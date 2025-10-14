"use client";

import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { getGroupData } from "@/services/groups/api";
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
import type { IconType } from "react-icons";
import { useRouter } from "next/navigation";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import { QUERY_KEYS } from "@/lib/query-keys";

interface ISidebarProps {
  id: GroupIdType;
}

export default function Sidebar({ id }: ISidebarProps) {
  const router = useRouter();
  const t = useTranslationsWithFallback("pages.GroupsPage.Sidebar");

  const groupQ = useActionQuery({
    queryKey: QUERY_KEYS.group(id),
    action: () => getGroupData({ groupId: id }),
    retry: false,
  });

  const group = groupQ.data;
  const isLoading = groupQ.isLoading;
  const groupName = group?.name ?? "Grupa";
  const membersCount = group?.members?.length ?? 0;

  const navItems: IconType[] = [FiUser, FiMessageCircle, FiFolder, FiGrid];

  const avatarSize = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <Box
      w={{ base: "100%", md: "17rem" }}
      p={{ base: 3, md: 4 }}
      borderBottom={{ base: "1px solid", md: "none" }}
      borderColor={{ base: "gray.200", md: "transparent" }}
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
            {navItems.map((Icon, idx) => {
              return (
                <IconButton
                  key={idx}
                  aria-label={t(`nav.${idx}`)}
                  icon={<Icon size={20} />}
                  size="lg"
                  variant="ghost"
                  onClick={() => {
                    /* na mobile nie ma na razie podstron, więc nie robi nic */
                  }}
                />
              );
            })}
          </HStack>
        </Flex>
      </Flex>

      <VStack display={{ base: "none", md: "flex" }} align="start" spacing={4}>
        <Link
          fontSize="sm"
          color="purple.500"
          onClick={() => router.push("/groups")}
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
            src={group?.imageUrl ?? undefined}
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
          {navItems.map((Icon, idx) => (
            <Link key={idx} _hover={{ textDecoration: "none" }}>
              <Flex
                align="center"
                gap={3}
                p={2}
                borderRadius="md"
                _hover={{ bg: "border.100", color: "accent.500" }}
              >
                <Icon size={18} />
                <Text>{t(`nav.${idx}`)}</Text>
              </Flex>
            </Link>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}