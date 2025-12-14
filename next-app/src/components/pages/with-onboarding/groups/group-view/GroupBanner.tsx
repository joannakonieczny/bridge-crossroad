import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonText,
  Stack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import type { GroupFullType } from "@/schemas/model/group/group-types";
import { AsyncImage } from "@/components/common/AsyncImage";
import { getPersonLabel, getDateLabel } from "@/util/formatters";

type IGroupBannerProps = {
  group?: GroupFullType;
  isLoading?: boolean;
};

export function GroupBannerLoader() {
  return (
    <Flex
      backgroundColor="bg"
      width="100%"
      paddingY="0.75rem"
      paddingX="2rem"
      direction="column"
      gap="2rem"
    >
      <Flex width="100%" direction={{ base: "column", md: "row" }}>
        <Flex
          width={{ base: "10rem", md: "10rem" }}
          height={{ base: "10rem", md: "10rem" }}
          marginRight={{ base: 0, md: 0 }}
          marginBottom={{ base: "1rem", md: 0 }}
          mx={{ base: "auto", md: 0 }}
        >
          <Skeleton height="100%" width="100%" borderRadius="md" />
        </Flex>

        <Flex direction="column" flex="1" pl={{ base: 0, md: "1.5rem" }}>
          <Skeleton height="26px" width="40%" mb={4} />
          <Stack
            direction={{ base: "column", md: "row" }}
            width="100%"
            spacing={{ base: 4, md: "2rem" }}
            justify="space-between"
          >
            <Skeleton height="56px" width={{ base: "100%", md: "20%" }} />
            <Skeleton height="56px" width={{ base: "100%", md: "20%" }} />
            <Skeleton height="56px" width={{ base: "100%", md: "20%" }} />
          </Stack>
        </Flex>
      </Flex>
      <SkeletonText mt="4" noOfLines={3} spacing="4" />
    </Flex>
  );
}

export default function GroupBanner({ group, isLoading }: IGroupBannerProps) {
  const t = useTranslations("pages.GroupsPage.GroupBanner");

  if (isLoading) {
    return <GroupBannerLoader />;
  }

  const title = group?.name ?? t("fallback.name");
  const description = group?.description ?? t("fallback.description");
  const adminNames =
    group?.admins && group.admins.length > 0
      ? group.admins.map((a) => getPersonLabel(a)).join(", ")
      : "-";
  const membersCount = group?.members?.length ?? 0;

  return (
    <Flex
      backgroundColor="bg"
      width="100%"
      paddingY="0.75rem"
      paddingX="1.5rem"
      direction="column"
      gap="1.25rem"
    >
      <Flex
        width="100%"
        direction={{ base: "column", md: "row" }}
        align="center"
      >
        <Flex
          width={{ base: "12rem", md: "12rem" }}
          height={{ base: "10rem", md: "10rem" }}
          flexShrink={0}
          borderRadius="md"
          overflow="hidden"
          align="stretch"
          mr={{ base: 0, md: 6 }}
          mb={{ base: 4, md: 0 }}
        >
          <Box
            backgroundColor="accent.100"
            width="0.75rem"
            height="100%"
            flex="0 0 0.75rem"
          />
          <Box width="100%" height="100%" flex="1 1 auto" position="relative">
            <AsyncImage
              src={group?.imageUrl}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Box>
        </Flex>

        <Flex direction="column" flex="1" minW={0}>
          <ResponsiveHeading
            fontSize="xl"
            text={title}
            showBar={false}
            width="100%"
          />
          <Text color="muted" mt={2} mb={3} noOfLines={3}>
            {description}
          </Text>

          <HStack spacing={6} align="flex-start">
            <Box>
              <ResponsiveHeading
                fontSize="sm"
                text={t("admin.title")}
                showBar={false}
              />
              <ResponsiveText>{adminNames}</ResponsiveText>
            </Box>

            <Box>
              <ResponsiveHeading
                fontSize="sm"
                text={t("createdAt.title")}
                showBar={false}
              />
              <ResponsiveText>{getDateLabel(group?.createdAt)}</ResponsiveText>
            </Box>

            <Box>
              <ResponsiveHeading
                fontSize="sm"
                text={t("membersCount.title")}
                showBar={false}
              />
              <ResponsiveText>
                {membersCount === 1
                  ? t("membersCount.single")
                  : t("membersCount.multiple", { count: membersCount })}
              </ResponsiveText>
            </Box>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
}
