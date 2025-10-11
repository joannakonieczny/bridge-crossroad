"use client";

import { GroupIdType } from "@/schemas/model/group/group-types";
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

interface ISidebarProps {
  id: GroupIdType;
}

export default function Sidebar({ id }: ISidebarProps) {
  const router = useRouter();
  const t = useTranslationsWithFallback("pages.GroupsPage.Sidebar");

  const groupQ = useActionQuery({
    queryKey: ["group", id],
    action: () => getGroupData({ groupId: id }),
    retry: false,
  });

  const group = groupQ.data;
  const isLoading = groupQ.isLoading;
  const groupName = group?.name ?? "Grupa";
  const membersCount = group?.members?.length ?? 0;

  const navItems: { icon: IconType; label: string }[] = [
    { icon: FiUser, label: "O grupie" },
    { icon: FiMessageCircle, label: "Czat" },
    { icon: FiFolder, label: "Materiały" },
    { icon: FiGrid, label: "Rozdania" },
  ];

  return (
    <Box w="17rem" p={4}>
      <VStack align="start" spacing={4}>
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
              <Text fontSize="sm" color="gray.500">
                {membersCount === 1 ? "1 członek" : `${membersCount} członków`}
              </Text>
            </>
          )}
        </Box>
      </VStack>

      <Divider my={4} />

      <VStack align="stretch" spacing={1}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} _hover={{ textDecoration: "none" }}>
              <Flex
                align="center"
                gap={3}
                p={2}
                borderRadius="md"
                _hover={{ bg: "gray.100", color: "purple.500" }}
              >
                <Icon size={18} />
                <Text>{t(`nav.${idx}`)}</Text>
              </Flex>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
}