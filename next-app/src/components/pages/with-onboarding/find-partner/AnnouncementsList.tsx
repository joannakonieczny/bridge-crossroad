"use client";

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
import Announcement from "./Announcement";
import { usePartnershipPostsQuery } from "@/lib/queries";
import dayjs from "dayjs";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { PartnershipPostsLimitPerPage } from "./util";
import {
  PartnershipPostStatus,
  PartnershipPostType,
} from "@/club-preset/partnership-post";
import { TrainingGroup } from "@/club-preset/training-group";
import { useTranslations } from "@/lib/typed-translations";

type ExperienceRange<T> = {
  min?: T;
  max?: T;
};

type OnboardingData = {
  startPlayingDate?: ExperienceRange<Date>;
  trainingGroup?: TrainingGroup;
};

const experienceMap: Record<string, ExperienceRange<number>> = {
  "<1": { min: 0, max: 1 },
  "1": { min: 1, max: 2 },
  "2": { min: 2, max: 3 },
  "3": { min: 3, max: 4 },
  "4": { min: 4, max: 5 },
  "5+": { min: 5 },
  "10+": { min: 10 },
  "15+": { min: 15 },
} as const;

export default function AnnoucementsList() {
  const t = useTranslations("pages.FindPartner.List");

  const [filters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    groupId: parseAsString,
    activity: parseAsString.withDefault("active"),
    frequency: parseAsString.withDefault("any"),
    experience: parseAsString.withDefault("any"),
    trainingGroup: parseAsString,
  });

  const validPage = Math.max(1, filters.page);

  const status =
    filters.activity === "inactive"
      ? PartnershipPostStatus.EXPIRED
      : PartnershipPostStatus.ACTIVE;

  const type =
    filters.frequency === PartnershipPostType.SINGLE
      ? PartnershipPostType.SINGLE
      : filters.frequency === PartnershipPostType.PERIOD
      ? PartnershipPostType.PERIOD
      : undefined;

  const trainingGroupParam =
    filters.trainingGroup === "none" ||
    filters.trainingGroup === TrainingGroup.NONE
      ? TrainingGroup.NONE
      : filters.trainingGroup ?? undefined;

  const toDateYearsAgo = (years?: number) => {
    if (!years) return undefined;
    return dayjs().subtract(years, "year").toDate();
  };

  let onboardingData: OnboardingData | undefined = undefined;
  if (filters.experience && filters.experience !== "any") {
    const experienceRange = experienceMap[filters.experience];
    if (experienceRange) {
      onboardingData = {
        startPlayingDate: {
          min: toDateYearsAgo(experienceRange.min),
          max: toDateYearsAgo(experienceRange.max),
        },
      };
    }
  }

  const trainingGroupIncluded =
    trainingGroupParam && trainingGroupParam !== TrainingGroup.COACH
      ? trainingGroupParam
      : undefined;

  if (trainingGroupIncluded !== undefined) {
    onboardingData = {
      ...(onboardingData || {}),
      trainingGroup: trainingGroupIncluded as TrainingGroup | undefined,
    };
  }

  const postsQuery = usePartnershipPostsQuery({
    page: validPage,
    limit: PartnershipPostsLimitPerPage,
    groupId: filters.groupId || undefined,
    status,
    type,
    onboardingData,
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

  if (postsQuery.isLoading || !postsQuery.data) {
    return <AnnouncementsSkeletonLoader />;
  }

  const posts = postsQuery.data?.data || [];

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
          {posts.map((p) => (
            <Announcement
              key={p.id}
              a={{
                id: p.id,
                title: p.name,
                date:
                  p.data.type === PartnershipPostType.PERIOD
                    ? p.data.endsAt
                    : p.data.event.duration.startsAt,
                owner: p.owner,
                frequency: p.data.type,
                preferredSystem: p.biddingSystem,
                description: p.description,
                groupId: filters.groupId || undefined,
                isUserInterested: p.isUserInterested || false,
                interestedUsers: p.interestedUsers || [],
                isOwnByUser: p.isOwnByUser || false,
              }}
            />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
