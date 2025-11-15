"use client";

import type { GroupIdType } from "@/schemas/model/group/group-types";
import {
  Box,
  Flex,
  VStack,
  Text,
  Avatar,
  Divider,
  Link,
  Skeleton,
  HStack,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiUser,
  FiMessageCircle,
  FiFolder,
  FiGrid,
} from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "@/lib/typed-translations";
import { useGroupQuery } from "@/lib/queries";
import { ROUTES } from "@/routes";

type ISidebarProps = {
  groupId: GroupIdType;
};

export default function Sidebar({ groupId }: ISidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("pages.GroupsPage.Sidebar");

  const groupQ = useGroupQuery(groupId);

  const group = groupQ.data;
  const isLoading = groupQ.isLoading;
  const groupName = group?.name ?? "";
  const membersCount = group?.members?.length ?? 0;

  const avatarSize = useBreakpointValue({ base: "md", md: "lg" });

  const navItems = [
    {
      icon: FiUser,
      pagePath: ROUTES.groups.groupDetails(groupId),
      text: t("nav.about"),
    },
    {
      icon: FiMessageCircle,
      pagePath: ROUTES.groups.chat(groupId),
      text: t("nav.chat"),
    },
    {
      icon: FiFolder,
      pagePath: ROUTES.groups.materials(groupId),
      text: t("nav.materials"),
    },
    {
      icon: FiGrid,
      pagePath: ROUTES.groups.hands(groupId),
      text: t("nav.hands"),
    },
  ];

  return (
    <Box
      w={{ base: "100%", md: "17rem" }}
      p={{ base: 3, md: 4 }}
      borderBottom={{ base: "1px solid", md: "none" }}
      borderColor={{ base: "border.200", md: "transparent" }}
    >
      <Flex
        display={{ base: "flex", md: "none" }}
        direction="row"
        align="flex-start"
        gap={4}
      >
        {isLoading ? (
          <Skeleton height="64px" width="64px" borderRadius="md" />
        ) : (
          <Avatar
            size={avatarSize}
            name={groupName}
            src={group?.imageUrl}
            borderRadius="md"
            alignSelf="flex-start"
          />
        )}
        {/* TODO add proper fallbacks when data is loading */}
        <Flex direction="column" flex="1" minW={0}>
          <Box>
            <Text fontWeight="bold" isTruncated>
              {groupName}
            </Text>
            <Text fontSize="sm" color="border.500">
              {membersCount === 1
                ? t("members.single")
                : t("members.multiple", { count: membersCount })}
            </Text>
          </Box>

          <HStack mt={2} spacing={2} justify="center">
            {navItems.map(({ icon: Icon, pagePath: path }, idx) => {
              const isActive = !!pathname && pathname === path;
              return (
                <IconButton
                  key={idx}
                  aria-label={"Navigate to " + path}
                  icon={<Icon size={20} />}
                  size="lg"
                  variant="ghost"
                  color={isActive ? "accent.500" : undefined}
                  onClick={() => router.push(path)}
                />
              );
            })}
          </HStack>
        </Flex>
      </Flex>

      <VStack display={{ base: "none", md: "flex" }} align="start" spacing={4}>
        <Link
          fontSize="sm"
          color="accent.500"
          onClick={() => router.push(ROUTES.groups.index)}
          _hover={{ textDecoration: "none" }}
        >
          <Flex align="center" gap={2}>
            <FiArrowLeft size={18} />
            <Text>{t("back")}</Text>
          </Flex>
        </Link>

        {isLoading ? (
          <Skeleton height="64px" width="64px" borderRadius="md" />
        ) : (
          <Avatar
            size="lg"
            name={groupName}
            src={group?.imageUrl} //TODO: add proper fallback image
            borderRadius="md"
          />
        )}

        <Box>
          {isLoading ? (
            <>
              <Skeleton height="16px" width="8rem" mb={2} />
              <Skeleton height="12px" width="4rem" />
            </>
          ) : (
            <>
              <Text fontWeight="bold">{groupName}</Text>
              <Text fontSize="sm" color="border.500">
                {membersCount === 1
                  ? t("members.single")
                  : t("members.multiple", { count: membersCount })}
              </Text>
            </>
          )}
        </Box>

        <Divider my={4} />

        <VStack align="stretch" spacing={1} w="100%">
          {navItems.map(({ icon: Icon, pagePath: path, text }, idx) => {
            const isActive = !!pathname && pathname === path;
            return (
              <Link
                key={idx}
                _hover={{ textDecoration: "none" }}
                onClick={() => router.push(path)}
              >
                <Flex
                  align="center"
                  gap={3}
                  p={2}
                  borderRadius="md"
                  color={isActive ? "accent.500" : undefined} // keep color highlighting only
                >
                  <Icon size={18} />
                  <Text>{text}</Text>
                </Flex>
              </Link>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
}
