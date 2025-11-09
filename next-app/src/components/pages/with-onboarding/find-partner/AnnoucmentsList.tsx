import React from "react";
import { Table, Thead, Tbody, Tr, Th, Box } from "@chakra-ui/react";
import Annoucment from "./Annoucment";

const MOCK: any[] = [
  {
    id: 1,
    title: "Turniej czwartkowy",
    date: "29.05.2025, 18:00",
    playerName: "Bartłomiej Szubiak",
    playerNick: "Barszu",
    frequency: "jednorazowa",
    preferredSystem: "Strefa",
  },
  {
    id: 2,
    title: "III liga 2025",
    date: "",
    playerName: "Szymon Kubiczek",
    playerNick: "Simsoftcik",
    frequency: "Sezon lub dłużej",
    preferredSystem: "Dubeltówka",
  },
  {
    id: 3,
    title: "Barometry w Żaczku",
    date: "",
    playerName: "Bartłomiej Szubiak",
    playerNick: "Barszu",
    frequency: "Cyklicznie lub kilka razy",
    preferredSystem: "Wspólny Język",
  },
  {
    id: 4,
    title: "Turniej czwartkowy",
    date: "29.05.2025, 18:00",
    playerName: "Bartłomiej Szubiak",
    playerNick: "Barszu",
    frequency: "jednorazowa",
    preferredSystem: "Strefa",
  },
  {
    id: 5,
    title: "Turniej czwartkowy",
    date: "29.05.2025, 18:00",
    playerName: "Bartłomiej Szubiak",
    playerNick: "Barszu",
    frequency: "jednorazowa",
    preferredSystem: "Strefa",
  },
];

export default function AnnoucmentsList() {
  return (
    <Box bg="bg" p={4} borderRadius="md">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Nazwa</Th>
            <Th>Zawodnik</Th>
            <Th>Charakterystyka zawodnika</Th>
            <Th>Częstotliwość</Th>
            <Th>Preferowany system</Th>
          </Tr>
        </Thead>
        <Tbody>
          {MOCK.map((m) => (
            <Annoucment key={m.id} a={m} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
