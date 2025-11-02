import React from "react";
import { Box, Heading, Text, OrderedList, ListItem, SimpleGrid, List } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";

export default function EventSpecificData({
  eventType,
  eventData,
}: {
  eventType?: EventType;
  eventData?: any;
}) {
  if (!eventType) return null;

  // small helper to render a pair with colored slash
  const PairInline = ({ first, second }: { first?: string; second?: string }) => (
    <>
      <Text as="span">{first ?? "-"}</Text>
      <Text as="span" mx={1} color="border.400">
        /
      </Text>
      <Text as="span">{second ?? "-"}</Text>
    </>
  );

  switch (eventType) {
    case EventType.TOURNAMENT: {
      const d = eventData ?? {};
      return (
        <Box bgColor="bg" p={4}>
          <Heading size="sm" mb={2}>Dane turnieju</Heading>

          {/* Typ i Sędzia w dwóch kolumnach (responsive) */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={2}>
            <Box>
              {d.tournamentType ? <Text><b>Typ:</b> {d.tournamentType}</Text> : <Text color="gray.500">Brak typu</Text>}
            </Box>
            <Box>
              {d.arbiter ? <Text><b>Sędzia:</b> {d.arbiter}</Text> : <Text color="gray.500">Brak sędziego</Text>}
            </Box>
          </SimpleGrid>

          {Array.isArray(d.contestantsPairs) && (
            <>
              <Heading size="xs" mt={3}>Pary:</Heading>
              <OrderedList mt={1} spacing={2}>
                {d.contestantsPairs.map((p: any, i: number) => (
                  <ListItem
                    key={i}
                    // color the marker (number) using theme token accent.500
                    sx={{ "::-webkit-list-marker": { color: "var(--chakra-colors-accent-500)" }, "::marker": { color: "var(--chakra-colors-accent-500)" } }}
                  >
                    <PairInline first={p.first} second={p.second} />
                  </ListItem>
                ))}
              </OrderedList>
            </>
          )}
        </Box>
      );
    }

    case EventType.LEAGUE_MEETING: {
      const d = eventData ?? {};
      return (
        <Box bgColor="bg" p={4}>
          <Heading size="sm" mb={2}>Dane zjazdu ligowego</Heading>

          {/* render sessions as a table for better readability */}
          {Array.isArray(d.session) && d.session.length > 0 ? (
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
                  {d.session.map((s: any, idx: number) => {
                    const isMatchOdd = (s.matchNumber ?? 0) % 2 === 1;
                    const isRowOdd = idx % 2 === 1; // row parity (0-based index)
                    return (
                      <Tr key={s.id}>
                        {/* "Mecz" cell: accent.500 for odd matches, secondary.500 for even */}
                        <Td
                          bg={isMatchOdd ? "accent.300" : "secondary.300"}
                          color="white"
                          fontWeight="semibold"
                        >
                          {s.matchNumber}
                        </Td>

                        {/* "Połowa" cell: background depends on ROW parity (isRowOdd) */}
                        <Td bg={isRowOdd ? "border.50" : "border.100"}>
                          {s.half}
                        </Td>

                        <Td>
                          {s.contestants?.firstPair ? (
                            <PairInline first={s.contestants.firstPair.first} second={s.contestants.firstPair.second} />
                          ) : (
                            "-"
                          )}
                        </Td>
                        <Td>
                          {s.contestants?.secondPair ? (
                            <PairInline first={s.contestants.secondPair.first} second={s.contestants.secondPair.second} />
                          ) : (
                            "-"
                          )}
                        </Td>
                        <Td>{s.opponentTeamName ?? "-"}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text color="border.500">Brak sesji do wyświetlenia</Text>
          )}
        </Box>
      );
    }

    case EventType.TRAINING: {
      const d = eventData ?? {};
      return (
        <Box bgColor="bg" p={4}>
          <Heading size="sm" mb={2}>Dane treningu</Heading>
          {d.coach && <Text><b>Trener:</b> {d.coach}</Text>}
          {d.topic && <Text><b>Temat:</b> {d.topic}</Text>}
        </Box>
      );
    }

    default: {
      const d = eventData ?? {};
      return (
        <Box bgColor="bg" p={4}>
          <Heading size="sm" mb={2}>Dane (inne)</Heading>
          {d.note ? <Text>{d.note}</Text> : <Text>Brak dodatkowych danych</Text>}
        </Box>
      );
    }
  }
}
