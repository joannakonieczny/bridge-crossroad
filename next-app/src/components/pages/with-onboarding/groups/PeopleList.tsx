'use client';

import { Flex, Table, Thead, Tbody, Tr, Th, Skeleton, Tfoot } from '@chakra-ui/react';
import { useState } from 'react';
import MainHeading from '@/components/common/texts/MainHeading';
import SearchInput from '@/components/common/SearchInput';
import UserTableRow from './group-view/UserTableRow';

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


  // mock (used when server members are not provided)
  const sampleData = [
    {
      fullName: 'Jan Kowalski',
      nickname: 'jan123',
      pzbsId: '123456',
      bboId: 'jk_bbo',
      cuebidsId: 'ABCABC',
    },
    {
      fullName: 'Michał Wiśniewski',
      nickname: 'MWisnia',
      pzbsId: '654321',
      bboId: 'michal_wisnia',
      cuebidsId: 'XYZXYZ',
    },
    {
      fullName: 'Piotr Nowak',
      nickname: 'pionowak',
      pzbsId: '',
      bboId: '',
      cuebidsId: '',
    },
  ];

  // If server members are present, map them to the table shape
  const serverData = members?.map((m) => ({
    fullName: `${m.name.firstName} ${m.name.lastName}`,
    nickname: m.nickname ?? '',
    pzbsId: '',
    bboId: '',
    cuebidsId: '',
  }));

  const sourceData = serverData ?? sampleData;

  const filteredData = sourceData.filter((user) => {
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
     direction={"column"}
     backgroundColor={"border.50"}
     padding={"2rem"}>
      <Flex flex={1} backgroundColor="bg" padding="2rem" direction="column" gap={6}>
        <MainHeading text="Członkowie Klubu" />
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj po imieniu, nazwisku, nicku..."
        />
        <Table variant="simple" width="100%">
          <Thead>
            <Tr>
              <Th>Imię i nazwisko</Th>
              <Th>Numer PZBS</Th>
              <Th>Nickname na BBO</Th>
              <Th>Kod zaproszenia na Cuebids</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading
              ? // show 4 skeleton rows while loading
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
              : filteredData.map((user, index) => (
                  <UserTableRow
                    key={index}
                    fullName={user.fullName}
                    nickname={user.nickname}
                    badges={user.pzbsId}
                    cezarNumber={user.cuebidsId}
                  />
                ))}
          </Tbody>
          {/** optional footer could go here */}
        </Table>
      </Flex>
    </Flex>
  );
}
