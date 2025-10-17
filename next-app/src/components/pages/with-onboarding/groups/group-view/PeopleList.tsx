"use client";

import {
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Skeleton,
  Box,
  useBreakpointValue,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import MainHeading from "@/components/common/texts/MainHeading";
import SearchInput from "@/components/common/SearchInput";
import UserTableRow from "./UserTableRow";
import { useTranslations } from "@/lib/typed-translations";
import type { UserTypeBasic } from "@/schemas/model/user/user-types";

type PeopleListProps = {
  members?: UserTypeBasic[];
  isLoading?: boolean;
};

type MobileMemberCardProps = {
  fullName: string;
  nickname: string;
};

function MobileMemberCard({ fullName, nickname }: MobileMemberCardProps) {
  return (
    <Box p={3} bg="bg" borderRadius="md" boxShadow="sm">
      <Text fontWeight="bold" fontSize="sm">
        {fullName}
      </Text>
      <Text fontSize="sm" color="border.500">
        {nickname}
      </Text>
    </Box>
  );
}

function DesktopTableSkeletons({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Tr key={i}>
          <Th>
            <Skeleton height="12px" width="120px" />
          </Th>
          <Th>
            <Skeleton height="12px" width="80px" />
          </Th>
          <Th>
            <Skeleton height="12px" width="100px" />
          </Th>
          <Th>
            <Skeleton height="12px" width="120px" />
          </Th>
        </Tr>
      ))}
    </>
  );
}

export default function PeopleList({ members, isLoading }: PeopleListProps) {
  const [search, setSearch] = useState("");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const t = useTranslations("pages.GroupsPage.PeopleList");

  const formattedMembersData =
    members?.map((m) => ({
      fullName: `${m.name.firstName} ${m.name.lastName}`,
      nickname: m.nickname ?? "",
      pzbsId: "",
      bboId: "",
      cuebidsId: "",
    })) ?? [];

  const filteredData = formattedMembersData.filter((user) => {
    const query = search.toLowerCase();
    return [
      user.fullName,
      user.nickname,
      user.pzbsId,
      user.bboId,
      user.cuebidsId,
    ].some((field) => field?.toLowerCase().includes(query));
  });

  return (
    <Flex
      flex={1}
      direction={"column"}
      backgroundColor={"border.50"}
      padding={{ base: "1rem", md: "2rem" }}
    >
      <Flex
        flex={1}
        backgroundColor="bg"
        padding={{ base: "1rem", md: "2rem" }}
        direction="column"
        gap={6}
      >
        <MainHeading text={t("heading")} />
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
        />

        {isMobile ? (
          // mobile: list of cards (PZBS etc. data hidden on mobile)
          <VStack spacing={3} align="stretch">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Box
                    key={i}
                    p={3}
                    bg="white"
                    borderRadius="md"
                    boxShadow="sm"
                  >
                    <Skeleton height="14px" width="60%" mb={2} />
                    <Skeleton height="12px" width="40%" />
                  </Box>
                ))
              : filteredData.map((user, idx) => (
                  <MobileMemberCard
                    key={idx}
                    fullName={user.fullName}
                    nickname={user.nickname}
                  />
                ))}
          </VStack>
        ) : (
          // desktop: table
          <Box overflowX="auto" width="100%">
            <Table variant="simple" width="100%">
              <Thead>
                <Tr>
                  <Th>{t("table.name")}</Th>
                  <Th>{t("table.pzbs")}</Th>
                  <Th>{t("table.bbo")}</Th>
                  <Th>{t("table.cuebids")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <DesktopTableSkeletons count={4} />
                ) : (
                  filteredData.map((user, index) => (
                    <UserTableRow
                      key={index}
                      fullName={user.fullName}
                      nickname={user.nickname}
                      pzbsNumber={user.pzbsId}
                      bboNickname={user.bboId}
                      cuebidsCode={user.cuebidsId}
                    />
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}
