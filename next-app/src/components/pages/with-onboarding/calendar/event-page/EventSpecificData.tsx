import React from "react";
import { Box, Heading, Text, OrderedList, ListItem, SimpleGrid, List, Spinner, Center } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import type { PersonWithName } from "@/schemas/model/event/event-types";

// NOTE: use local UI-focused types (populated shapes) instead of repository/schema types
type PlayingPairUI = {
  first: PersonWithName;
  second: PersonWithName;
};

type TournamentUI = {
  type: "TOURNAMENT";
  tournamentType?: string;
  contestantsPairs: PlayingPairUI[];
  teams?: Array<{ name: string; members: PersonWithName[] }>;
  arbiter?: PersonWithName | string | undefined;
};

type LeagueSessionUI = {
  id?: string;
  matchNumber: number;
  half: number;
  contestants: {
    firstPair: PlayingPairUI;
    secondPair: PlayingPairUI;
  };
  opponentTeamName?: string;
};

type LeagueUI = {
  type: "LEAGUE_MEETING";
  tournamentType?: string;
  session: LeagueSessionUI[];
};

type TrainingUI = {
  type: "TRAINING";
  coach?: PersonWithName | string | undefined;
  topic?: string;
};

type OtherUI = {
  type: string;
  note?: string;
};

type EventDataUI = TournamentUI | LeagueUI | TrainingUI | OtherUI;

export default function EventSpecificData({
  eventType,
  eventData,
  loading,
}: {
  eventType?: EventType;
  eventData?: EventDataUI;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Box bgColor="bg" p={4}>
        <Center py={6}><Spinner /></Center>
      </Box>
    );
  }
  if (!eventType || !eventData) return null;

  // helper to render pair when values are objects containing name: { firstName, lastName }
  const PairInline = ({ first, second }: { first?: any; second?: any }) => {
    const fFirst = first?.name?.firstName ?? "";
    const fLast = first?.name?.lastName ?? "";
    const sFirst = second?.name?.firstName ?? "";
    const sLast = second?.name?.lastName ?? "";

    const leftLabel = (fFirst || fLast)
      ? `${fFirst} ${fLast}`.trim()
      : (first?.id ? String(first.id) : "-");
    const rightLabel = (sFirst || sLast)
      ? `${sFirst} ${sLast}`.trim()
      : (second?.id ? String(second.id) : "-");

    return (
      <>
        <Text as="span">{leftLabel}</Text>
        <Text as="span" mx={1} color="border.400">/</Text>
        <Text as="span">{rightLabel}</Text>
      </>
    );
  };

  switch (eventType) {
    case EventType.TOURNAMENT: {
      const d = eventData as TournamentUI;
      return (
        <Box bgColor="bg" p={4}>
          <Heading size="sm" mb={2}>Dane turnieju</Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={2}>
            <Box>
              <Text><b>Typ:</b> {d.tournamentType}</Text>
            </Box>
            <Box>
              {/* arbiter: use name.firstName/name.lastName or id/string fallback */}
              {(() => {
                const arb = d.arbiter as PersonWithName | string | undefined;
                const arbLabel =
                  typeof arb === "string"
                    ? arb
                    : arb?.name
                    ? `${arb.name.firstName ?? ""} ${arb.name.lastName ?? ""}`.trim()
                    : arb?.id
                    ? String(arb.id)
                    : undefined;
                return <Text><b>Sędzia:</b> {arbLabel ?? "Brak sędziego"}</Text>;
              })()}
            </Box>
          </SimpleGrid>

          <Heading size="xs" mt={3}>Pary:</Heading>
          <OrderedList mt={1} spacing={2}>
            {d.contestantsPairs.map((p, i) => (
              <ListItem
                key={i}
                sx={{ "::-webkit-list-marker": { color: "var(--chakra-colors-accent-500)" }, "::marker": { color: "var(--chakra-colors-accent-500)" } }}
              >
                <PairInline first={p.first} second={p.second} />
              </ListItem>
            ))}
          </OrderedList>
        </Box>
      );
    }

    case EventType.LEAGUE_MEETING: {
      const d = eventData as LeagueUI;
      return (
        <Box bgColor="bg" p={4}>
          <Heading size="sm" mb={2}>Dane zjazdu ligowego</Heading>
          <Text mb={3}><b>Typ:</b> {d.tournamentType}</Text>

          <TableContainer mt={3}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Mecz</Th>
                  <Th>Połowa</Th>
                  <Th>Para 1</Th>
                  <Th>Para 2</Th>
                  <Th>Przeciwnik</Th>
                </Tr>
              </Thead>
              <Tbody>
                {d.session.map((s, idx) => {
                  const isMatchOdd = (s.matchNumber ?? 0) % 2 === 1;
                  const isRowOdd = idx % 2 === 1;
                  return (
                    <Tr key={s.id}>
                      <Td bg={isMatchOdd ? "accent.300" : "secondary.300"} color="white" fontWeight="semibold">
                        {s.matchNumber}
                      </Td>

                      <Td bg={isRowOdd ? "border.50" : "border.100"}>
                        {s.half}
                      </Td>

                      <Td>
                        <PairInline first={s.contestants.firstPair.first} second={s.contestants.firstPair.second} />
                      </Td>
                      <Td>
                        <PairInline first={s.contestants.secondPair.first} second={s.contestants.secondPair.second} />
                      </Td>
                      <Td>{s.opponentTeamName ?? "-"}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      );
    }

    case EventType.TRAINING: {
      const d = eventData as TrainingUI;
      return (
        <Box bgColor="bg" p={4}>
          <Heading size="sm" mb={2}>Dane treningu</Heading>
          {/* coach: use name.firstName/name.lastName or id/string fallback */}
          {(() => {
            const coach = d.coach as PersonWithName | string | undefined;
            const coachLabel =
              typeof coach === "string"
                ? coach
                : coach?.name
                ? `${coach.name.firstName ?? ""} ${coach.name.lastName ?? ""}`.trim()
                : coach?.id
                ? String(coach.id)
                : undefined;
            return <Text><b>Trener:</b> {coachLabel ?? "Brak trenera"}</Text>;
          })()}
           <Text><b>Temat:</b> {d.topic}</Text>
        </Box>
      );
    }

    default: {
      const d = eventData as OtherUI;
      return (
        <Box bgColor="bg" p={4}>
          <Heading size="sm" mb={2}>Dane (inne)</Heading>
          <Text>{(d as any).note ?? "Brak dodatkowych danych"}</Text>
        </Box>
      );
    }
  }
}
