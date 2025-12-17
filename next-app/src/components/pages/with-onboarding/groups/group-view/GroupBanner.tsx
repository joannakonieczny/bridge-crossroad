import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  SimpleGrid,
  Wrap,
  WrapItem,
  Tag,
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import GroupAdminMenu from "./admin-tools/GroupAdminMenu";
import { useTranslations } from "@/lib/typed-translations";
import type { GroupFullType } from "@/schemas/model/group/group-types";
import { AsyncImage } from "@/components/common/AsyncImage";
import { getPersonLabel, getDateLabel } from "@/util/formatters";

type IGroupBannerProps = {
  group?: GroupFullType;
  isLoading?: boolean;
  isAdmin?: boolean;
};

/* ===================== LOADER ===================== */

export function GroupBannerLoader() {
  return (
    <Box bg="bg" borderRadius="xl" borderWidth="1px" p={{ base: 4, md: 6 }}>
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Skeleton
          w={{ base: "100%", md: "12rem" }}
          h="10rem"
          borderRadius="lg"
        />

        <Flex flex="1" direction="column" gap={4}>
          <Skeleton h="28px" w="50%" />
          <SkeletonText noOfLines={2} spacing={3} />

          <Stack spacing={2} mt={2}>
            <Skeleton h="20px" w="30%" />
            <Skeleton h="40px" />
          </Stack>

          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mt={4}>
            <Skeleton h="56px" />
            <Skeleton h="56px" />
          </SimpleGrid>
        </Flex>
      </Flex>
    </Box>
  );
}

/* ===================== MAIN ===================== */

export default function GroupBanner({ group, isLoading }: IGroupBannerProps) {
  const t = useTranslations("pages.GroupsPage.GroupBanner");
  const { colorMode } = useColorMode();

  if (isLoading || !group) return <GroupBannerLoader />;

  const adminNames = group.admins.map((a) => getPersonLabel(a)) || [];
  const membersCount = group.members?.length ?? 0;

  return (
    <Box bg={colorMode === "dark" ? "neutral.100" : "bg"} borderRadius="xl" borderWidth="1px" p={{ base: 4, md: 6 }}>
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        {/* IMAGE */}
        <Flex
          w={{ base: "100%", md: "10rem", lg: "14rem" }}
          h="12rem"
          borderRadius="lg"
          overflow="hidden"
          flexShrink={0}
        >
          <Box w="4px" bg="accent.500" />
          <AsyncImage
            src={group.imageUrl}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Flex>

        {/* CONTENT */}
        <Flex direction="column" flex="1" minW={0}>
          <ResponsiveHeading
            fontSize="xl"
            text={group.name || t("fallback.name")}
            showBar={false}
          />

          <Text color="muted" mt={2} noOfLines={3}>
            {group.description || t("fallback.description")}
          </Text>

          {/* META */}
          <Flex gap="2rem" mt={"1rem"} flexWrap="wrap">
            <Box>
              <Text fontSize="sm" color="muted" mb={1}>
                {t("createdAt.title")}
              </Text>
              <ResponsiveText noOfLines={2}>
                {getDateLabel(group.createdAt)}
              </ResponsiveText>
            </Box>

            <Box>
              <Text fontSize="sm" color="muted" mb={1}>
                {t("membersCount.title")}
              </Text>
              <ResponsiveText noOfLines={2}>
                {membersCount === 1
                  ? t("membersCount.single")
                  : t("membersCount.multiple", { count: membersCount })}
              </ResponsiveText>
            </Box>
          </Flex>

          {/* ADMINS */}
          <Box mt={4}>
            <Text fontSize="sm" color="muted" mb={2}>
              {t("admin.title")}
            </Text>

            <Wrap spacing={2}>
              {adminNames.map((admin) => (
                <WrapItem key={admin}>
                  <Tag
                    size="md"
                    borderRadius="full"
                    variant="subtle"
                    colorScheme="accent"
                  >
                    {admin}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        </Flex>
      </Flex>
      <HStack pt="1rem">
        {group.isAdmin && <GroupAdminMenu group={group} />}
      </HStack>
    </Box>
  );
}
