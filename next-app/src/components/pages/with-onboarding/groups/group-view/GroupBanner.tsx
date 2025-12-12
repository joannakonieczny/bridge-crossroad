import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { Box, Flex, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import type { GroupFullType } from "@/schemas/model/group/group-types";
import { AsyncImage } from "@/components/common/AsyncImage";

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
      ? group.admins
          .map(
            (a) =>
              `${a.name.firstName} ${a.name.lastName}${
                a.nickname ? ` (${a.nickname})` : ""
              }`
          )
          .join(", ")
      : "-";
  const membersCount = group?.members?.length ?? 0;

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
        {" "}
        {/* top - responsive */}
        <Flex
          width={{ base: "10rem", md: "10rem" }}
          height={{ base: "10rem", md: "10rem" }}
          marginRight={{ base: 0, md: 0 }}
          marginBottom={{ base: "1rem", md: 0 }}
          overflow="hidden"
          borderRadius="md"
          align="stretch"
          mx={{ base: "auto", md: 0 }}
        >
          <Box
            backgroundColor="accent.100"
            width="1rem"
            height="100%"
            flex="0 0 1rem"
          />
          <Box width="100%" height="100%" flex="1 1 auto" position="relative">
            <AsyncImage src={group?.imageUrl} w="100%" h="100%" />
          </Box>
        </Flex>
        <Flex direction="column" flex="1" pl={{ base: 0, md: "1.5rem" }}>
          {/* details with left padding on desktop */}
          <ResponsiveHeading
            fontSize="xl"
            text={title}
            showBar={false}
            width="100%"
          />
          <Stack
            direction={{ base: "column", md: "row" }}
            width="100%"
            spacing={{ base: 4, md: "2rem" }}
            justify="space-between"
          >
            <Flex direction="column">
              <ResponsiveHeading
                fontSize="md"
                text={t("admin.title")}
                showBar={false}
              />
              <ResponsiveText>{adminNames}</ResponsiveText>
            </Flex>
            <Flex direction="column">
              <ResponsiveHeading
                fontSize="md"
                text={t("createdAt.title")}
                showBar={false}
              />
              <ResponsiveText>
                {group?.createdAt
                  ? new Date(group.createdAt).toLocaleDateString()
                  : "-"}
              </ResponsiveText>
            </Flex>
            <Flex direction="column">
              <ResponsiveHeading
                fontSize="md"
                text={t("membersCount.title")}
                showBar={false}
              />
              <ResponsiveText>
                {membersCount === 1
                  ? t("membersCount.single")
                  : t("membersCount.multiple", { count: membersCount })}
              </ResponsiveText>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
      <Flex direction="column">
        {" "}
        {/* description */}
        <ResponsiveHeading
          barOrientation="horizontal"
          fontSize="md"
          text={t("description.title")}
          showBar={true}
        />
        <ResponsiveText>{description}</ResponsiveText>
      </Flex>
    </Flex>
  );
}
