import React, { useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Box, Skeleton, SkeletonText, Td } from "@chakra-ui/react";
import Annoucment from "./Annoucment";
import { useGroupQuery, useJoinedGroupsQuery, usePartnershipPostsQuery } from "@/lib/queries";
import dayjs from "dayjs";
import { PartnershipPostSchemaTypePopulated } from "@/schemas/model/partnership-post/partnership-post-types";
import { useQueryState } from "nuqs";
import { PartnershipPostsLimitPerPage } from "@/club-preset/partnership-post";
import { PartnershipPostStatus, PartnershipPostType } from "@/club-preset/partnership-post";
import { TrainingGroup } from "@/club-preset/training-group";

export default function AnnoucmentsList() {
  const [page] = useQueryState("page", {
    defaultValue: 1,
    parse: (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
    },
    serialize: (v: number) => String(v ?? 1),
  });

  const [groupIdParamRaw] = useQueryState("groupId");
  const groupIdParam = groupIdParamRaw ? String(groupIdParamRaw) : undefined;

  const [activityParamRaw] = useQueryState("activity");
  const activityParam = activityParamRaw ? String(activityParamRaw) : "active";
  const status = activityParam === "inactive" ? PartnershipPostStatus.EXPIRED : PartnershipPostStatus.ACTIVE;

  // read frequency param from URL (values: "any" | "SINGLE" | "PERIOD")
  const [frequencyParamRaw] = useQueryState("frequency");
  const frequencyParam = frequencyParamRaw ? String(frequencyParamRaw) : "any";
  const type =
    frequencyParam === PartnershipPostType.SINGLE
      ? PartnershipPostType.SINGLE
      : frequencyParam === PartnershipPostType.PERIOD
      ? PartnershipPostType.PERIOD
      : undefined;

  // read experience param from URL
  const [experienceParamRaw] = useQueryState("experience");
  const experienceParam = experienceParamRaw ? String(experienceParamRaw) : "any";

  // read trainingGroup from URL (sync with FiltersBar)
  const [trainingGroupParamRaw] = useQueryState("trainingGroup");
  const rawTG = trainingGroupParamRaw ? String(trainingGroupParamRaw) : undefined;
  // normalize legacy "none" or "not_participating" into enum TrainingGroup.NONE
  const trainingGroupParam =
    rawTG === "none" || rawTG === TrainingGroup.NONE ? TrainingGroup.NONE : rawTG ?? undefined;

  // convert experience bucket into onboardingData.startPlayingDate { min?: Date, max?: Date }
  const toDateYearsAgo = (years: number) => dayjs().subtract(years, "year").toDate();

  let onboardingData: any = undefined;
  if (experienceParam && experienceParam !== "any") {
    if (experienceParam === "<1") {
      // started less than 1 year ago -> startPlayingDate in [now - 1yr, now]
      onboardingData = { startPlayingDate: { min: toDateYearsAgo(1), max: new Date() } };
    } else if (experienceParam === "1") {
      onboardingData = { startPlayingDate: { min: toDateYearsAgo(2), max: toDateYearsAgo(1) } };
    } else if (experienceParam === "2") {
      onboardingData = { startPlayingDate: { min: toDateYearsAgo(3), max: toDateYearsAgo(2) } };
    } else if (experienceParam === "3") {
      onboardingData = { startPlayingDate: { min: toDateYearsAgo(4), max: toDateYearsAgo(3) } };
    } else if (experienceParam === "4") {
      onboardingData = { startPlayingDate: { min: toDateYearsAgo(5), max: toDateYearsAgo(4) } };
    } else if (experienceParam === "5+") {
      // started 5 or more years ago -> startPlayingDate <= now -5yr
      onboardingData = { startPlayingDate: { max: toDateYearsAgo(5) } };
    } else if (experienceParam === "10+") {
      onboardingData = { startPlayingDate: { max: toDateYearsAgo(10) } };
    } else if (experienceParam === "15+") {
      onboardingData = { startPlayingDate: { max: toDateYearsAgo(15) } };
    }
  }

  // include trainingGroup in onboardingData only when provided and NOT coach
  const trainingGroupIncluded =
    trainingGroupParam && trainingGroupParam !== TrainingGroup.COACH
      ? trainingGroupParam
      : undefined;

  if (trainingGroupIncluded !== undefined) {
    onboardingData = { ...(onboardingData ?? {}), trainingGroup: trainingGroupIncluded };
  }

  // pass primitive onboardingBucket (experience + trainingGroupIncluded) to avoid unstable queryKey changes
  const onboardingBucket = `${experienceParam}|${trainingGroupIncluded ?? "none"}`;
  const postsQuery = usePartnershipPostsQuery(
    { page, limit: PartnershipPostsLimitPerPage, groupId: groupIdParam, status, type, onboardingData, onboardingBucket },
  );

  useEffect(() => {
    console.log("partnership posts:", postsQuery.data);
  }, [postsQuery.data]);

  if (postsQuery.isLoading) {
    return (
      <Box bg="bg" p={4} borderRadius="md">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Nazwa</Th>
              <Th>Zawodnik</Th>
              <Th display={{ base: "none", md: "table-cell" }}>Częstotliwość</Th>
              <Th display={{ base: "none", md: "table-cell" }}>Preferowany system</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <Tr key={`skeleton-${i}`}>
                <Td py={2}>
                  <Box>
                    <Skeleton height="16px" mb={2} />
                    <SkeletonText noOfLines={1} spacing="2" />
                  </Box>
                </Td>
                <Td py={2}>
                  <Skeleton height="16px" />
                </Td>
                <Td py={2} display={{ base: "none", md: "table-cell" }}>
                  <Skeleton height="16px" />
                </Td>
                <Td py={2} display={{ base: "none", md: "table-cell" }}>
                  <Skeleton height="16px" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  }

  const raw = postsQuery.data as any;
  const posts: PartnershipPostSchemaTypePopulated[] = Array.isArray(raw) ? raw : raw.data;

  const parseDate = (s: string) => {
    const cleaned = String(s).replace(/^\$D/, "");
    const d = dayjs(cleaned);
    return d.isValid() ? d.format("DD.MM.YYYY, HH:mm") : "";
  };

  return (
    <Box bg="bg" p={4} borderRadius="md">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Nazwa</Th>
            <Th>Zawodnik</Th>
            <Th display={{ base: "none", md: "table-cell" }}>Częstotliwość</Th>
            <Th display={{ base: "none", md: "table-cell" }}>Preferowany system</Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts.map((p: PartnershipPostSchemaTypePopulated) => {
            const id = p.id;
            const title = p.name;
            const frequency = p.data.type; // "SINGLE" lub "PERIOD"
            const preferredSystem = p.biddingSystem;
            const date =
              p.data.type === "PERIOD"
                ? parseDate(p.data.endsAt as unknown as string)
                : parseDate(p.data.event.duration.startsAt as unknown as string);
            const owner = p.owner;
            const playerName = `${owner.name.firstName} ${owner.name.lastName}`;
            const playerNick = owner.nickname;
            const description = p.description;

            const interestedUsers = (p as any).interestedUsers ?? (p as any).intrestedUSers ?? [];

            const ann: any = {
              id,
              title,
              date,
              playerName,
              playerNick,
              frequency,
              preferredSystem,
              description,
              interestedUsers,
            };

            return <Annoucment key={id} a={ann} />;
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
