import React from "react";
import { Box, Heading, Text, OrderedList, ListItem, SimpleGrid, List } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";

export default function EventSpecificData({
  eventType,
  eventData,
}: {
  eventType?: EventType;
  eventData?: any;
}) {
  if (!eventType) return null;

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
                    {p.first} — {p.second}
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
          {d.tournamentType && <Text><b>Typ:</b> {d.tournamentType}</Text>}
          {Array.isArray(d.session) && (
            <>
              <Heading size="xs" mt={3}>Sesje:</Heading>
              <List spacing={2} mt={2}>
                {d.session.map((s: any) => (
                  <ListItem key={s.id}>
                    <Text><b>Match #{s.matchNumber} (połowa {s.half})</b></Text>
                    <Text>1: {s.contestants?.firstPair?.first}/{s.contestants?.firstPair?.second}</Text>
                    <Text>2: {s.contestants?.secondPair?.first}/{s.contestants?.secondPair?.second}</Text>
                    {s.opponentTeamName && <Text>Przeciwnik: {s.opponentTeamName}</Text>}
                  </ListItem>
                ))}
              </List>
            </>
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
