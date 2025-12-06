import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Box,
  Skeleton,
  SkeletonText,
  Td,
} from "@chakra-ui/react";
import Annoucement from "./Annoucement";
import { usePartnershipPostsQuery } from "@/lib/queries";
import dayjs from "dayjs";
import type { PartnershipPostSchemaTypePopulated } from "@/schemas/model/partnership-post/partnership-post-types";
import { useQueryState } from "nuqs";
import { PartnershipPostsLimitPerPage } from "./util";
import {
  PartnershipPostStatus,
  PartnershipPostType,
} from "@/club-preset/partnership-post";
import { TrainingGroup } from "@/club-preset/training-group";
import { useTranslations } from "@/lib/typed-translations";

export default function AnnoucementsList() {
  const t = useTranslations("pages.FindPartner.List");
  const [page] = useQueryState("page", {
    defaultValue: 1,
    parse: (v: unknown) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
    },
    serialize: (v: number) => String(v ?? 1),
  });

  const [groupIdParamRaw] = useQueryState("groupId");
  const groupIdParam = groupIdParamRaw ? String(groupIdParamRaw) : undefined;

  const [activityParamRaw] = useQueryState("activity");
  const activityParam = activityParamRaw ? String(activityParamRaw) : "active";
  const status =
    activityParam === "inactive"
      ? PartnershipPostStatus.EXPIRED
      : PartnershipPostStatus.ACTIVE;

  const [frequencyParamRaw] = useQueryState("frequency");
  const frequencyParam = frequencyParamRaw ? String(frequencyParamRaw) : "any";
  const type =
    frequencyParam === PartnershipPostType.SINGLE
      ? PartnershipPostType.SINGLE
      : frequencyParam === PartnershipPostType.PERIOD
      ? PartnershipPostType.PERIOD
      : undefined;

  const [experienceParamRaw] = useQueryState("experience");
  const experienceParam = experienceParamRaw
    ? String(experienceParamRaw)
    : "any";

  const [trainingGroupParamRaw] = useQueryState("trainingGroup");
  const rawTG = trainingGroupParamRaw
    ? String(trainingGroupParamRaw)
    : undefined;
  const trainingGroupParam =
    rawTG === "none" || rawTG === TrainingGroup.NONE
      ? TrainingGroup.NONE
      : rawTG ?? undefined;

  const toDateYearsAgo = (years: number) =>
    dayjs().subtract(years, "year").toDate();

  type OnboardingData = {
    startPlayingDate?: { min?: Date; max?: Date };
    trainingGroup?: TrainingGroup;
  };

  let onboardingData: OnboardingData | undefined = undefined;
  if (experienceParam && experienceParam !== "any") {
    if (experienceParam === "<1") {
      onboardingData = {
        startPlayingDate: { min: toDateYearsAgo(1), max: new Date() },
      };
    } else if (experienceParam === "1") {
      onboardingData = {
        startPlayingDate: { min: toDateYearsAgo(2), max: toDateYearsAgo(1) },
      };
    } else if (experienceParam === "2") {
      onboardingData = {
        startPlayingDate: { min: toDateYearsAgo(3), max: toDateYearsAgo(2) },
      };
    } else if (experienceParam === "3") {
      onboardingData = {
        startPlayingDate: { min: toDateYearsAgo(4), max: toDateYearsAgo(3) },
      };
    } else if (experienceParam === "4") {
      onboardingData = {
        startPlayingDate: { min: toDateYearsAgo(5), max: toDateYearsAgo(4) },
      };
    } else if (experienceParam === "5+") {
      onboardingData = { startPlayingDate: { max: toDateYearsAgo(5) } };
    } else if (experienceParam === "10+") {
      onboardingData = { startPlayingDate: { max: toDateYearsAgo(10) } };
    } else if (experienceParam === "15+") {
      onboardingData = { startPlayingDate: { max: toDateYearsAgo(15) } };
    }
  }

  const trainingGroupIncluded =
    trainingGroupParam && trainingGroupParam !== TrainingGroup.COACH
      ? trainingGroupParam
      : undefined;

  if (trainingGroupIncluded !== undefined) {
    onboardingData = {
      ...(onboardingData ?? {}),
      trainingGroup: trainingGroupIncluded as TrainingGroup | undefined,
    };
  }

  const onboardingBucket = `${experienceParam}|${
    trainingGroupIncluded ?? "none"
  }`;
  const postsQuery = usePartnershipPostsQuery({
    page,
    limit: PartnershipPostsLimitPerPage,
    groupId: groupIdParam,
    status,
    type,
    onboardingData,
    onboardingBucket,
  });

  function AnnouncementsSkeletonLoader() {
    return (
      <Box bg="bg" p={4} borderRadius="md">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>{t("tableHeaders.name")}</Th>
              <Th>{t("tableHeaders.player")}</Th>
              <Th display={{ base: "none", md: "table-cell" }}>
                {t("tableHeaders.frequency")}
              </Th>
              <Th display={{ base: "none", md: "table-cell" }}>
                {t("tableHeaders.preferredSystem")}
              </Th>
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

  if (postsQuery.isLoading) {
    return <AnnouncementsSkeletonLoader />;
  }

  const posts: PartnershipPostSchemaTypePopulated[] = Array.isArray(
    postsQuery.data
  )
    ? postsQuery.data
    : postsQuery.data?.data ?? [];

  const parseDate = (s?: string): Date | undefined => {
    if (!s) return undefined;
    const d = new Date(String(s));
    return Number.isFinite(d.getTime()) ? d : undefined;
  };

  return (
    <Box bg="bg" p={4} borderRadius="md">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>{t("tableHeaders.name")}</Th>
            <Th>{t("tableHeaders.player")}</Th>
            <Th display={{ base: "none", md: "table-cell" }}>
              {t("tableHeaders.frequency")}
            </Th>
            <Th display={{ base: "none", md: "table-cell" }}>
              {t("tableHeaders.preferredSystem")}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts.map((p: PartnershipPostSchemaTypePopulated) => {
            const id = p.id;
            const title = p.name;
            const frequency = p.data.type;
            const preferredSystem = p.biddingSystem;
            const date: Date | undefined =
              p.data.type === "PERIOD"
                ? parseDate(p.data.endsAt as unknown as string)
                : parseDate(
                    p.data.event.duration.startsAt as unknown as string
                  );
            const owner = p.owner;
            const description = p.description;

            const interestedUsers = p.interestedUsers ?? [];

            const ann = {
              id,
              title,
              date,
              owner,
              frequency,
              preferredSystem,
              description,
              groupId: groupIdParam,
              isUserInterested: p.isUserInterested ?? false,
              interestedUsers,
              isOwnByUser: p.isOwnByUser ?? false,
            };

            return <Annoucement key={id} a={ann} />;
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
