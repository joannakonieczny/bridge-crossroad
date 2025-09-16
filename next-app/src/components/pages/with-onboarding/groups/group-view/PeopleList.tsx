"use client";

import { Flex, Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import { useState } from "react";
import MainHeading from "@/components/common/texts/MainHeading";
import SearchInput from "@/components/common/SearchInput";
import UserTableRow from "./UserTableRow";

export default function PeopleList() {
  const [search, setSearch] = useState("");

  // 🔹 Mockowe dane zgodne z nowym modelem
  const sampleData = [
    {
      fullName: "Jan Kowalski",
      nickname: "jan123",
      badges: "test",
      cezarNumber: "12345",
    },
    {
      fullName: "Michał Wiśniewski",
      nickname: "MWisnia",
      badges: "test",
      cezarNumber: "12345",
    },
    {
      fullName: "Piotr Nowak",
      nickname: "pionowak",
      badges: "test",
      cezarNumber: "12345",
    },
  ];

  // 🔹 Filtrowanie po fullName i nickname
  const filteredData = sampleData.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(query) ||
      user.nickname?.toLowerCase().includes(query)
    );
  });

  return (
    <Flex flex={1} direction="column" backgroundColor="border.50">
      <Flex flex={1} backgroundColor="white" padding="2rem" direction="column" gap={6}>
        <MainHeading text="Członkowie Grupy" />
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj po imieniu, nazwisku, nicku..."
        />

        <Table variant="simple" width="100%">
          <Thead>
            <Tr>
              <Th>Imię i nazwisko / Nickname</Th>
              <Th>Odznaki</Th>
              <Th>Numer Cezar</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((user, index) => (
              <UserTableRow
                key={index}
                fullName={user.fullName}
                nickname={user.nickname}
                badges={user.badges}
                cezarNumber={user.cezarNumber}
              />
            ))}
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
}
