'use client';

import { Flex, Table, Thead, Tbody, Tr, Th } from '@chakra-ui/react';
import { useState } from 'react';
import MainHeading from '@/components/common/texts/MainHeading';
import SearchInput from '@/components/common/SearchInput';
import UserTableRow from './UserTableRow';

export default function PeopleList() {
  const [search, setSearch] = useState('');


  // mock
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

  const filteredData = sampleData.filter((user) => {
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
            {filteredData.map((user, index) => (
              <UserTableRow
                key={index}
                fullName={user.fullName}
                nickname={user.nickname}
                pzbsId={user.pzbsId}
                bboId={user.bboId}
                cuebidsId={user.cuebidsId}
              />
            ))}
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
}
