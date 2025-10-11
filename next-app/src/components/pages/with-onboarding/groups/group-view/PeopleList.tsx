'use client';

import { Flex, Table, Thead, Tbody, Tr, Th, Skeleton } from '@chakra-ui/react';
import { useState } from 'react';
import MainHeading from '@/components/common/texts/MainHeading';
import SearchInput from '@/components/common/SearchInput';
import UserTableRow from './UserTableRow';
import { useTranslationsWithFallback } from "@/lib/typed-translations";

type MemberMin = {
  _id: string;
  name: { firstName: string; lastName: string };
  nickname?: string;
};

interface PeopleListProps {
  members?: MemberMin[];
  isLoading?: boolean;
}

export default function PeopleList({ members, isLoading }: PeopleListProps) {
  const [search, setSearch] = useState('');
  const t = useTranslationsWithFallback("pages.GroupsPage.PeopleList");

  const serverData = members?.map((m) => ({
    fullName: `${m.name.firstName} ${m.name.lastName}`,
    nickname: m.nickname ?? '',
    pzbsId: '',
    bboId: '',
    cuebidsId: '',
  })) ?? [];

  const filteredData = serverData.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(query) ||
      user.nickname?.toLowerCase().includes(query) ||
      user.pzbsId?.toLowerCase().includes(query) ||
      user.bboId?.toLowerCase().includes(query) ||
      user.cuebidsId?.toLowerCase().includes(query)
    );
  });

  return (
    <Flex
      flex={1}
      direction={'column'}
      backgroundColor={'border.50'}
      padding={'2rem'}
    >
      <Flex flex={1} backgroundColor="bg" padding="2rem" direction="column" gap={6}>
        <MainHeading text={t("heading")} />
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
        />
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
            {isLoading
              ? 
                Array.from({ length: 4 }).map((_, i) => (
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
                ))
              : 
                filteredData.map((user, index) => (
                  <UserTableRow
                    key={index}
                    fullName={user.fullName}
                    nickname={user.nickname}
                    pzbsNumber={user.pzbsId}
                    bboNickname={user.bboId}
                    cuebidsCode={user.cuebidsId}
                  />
                ))}
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
}
