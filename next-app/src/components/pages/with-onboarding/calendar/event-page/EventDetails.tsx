import React from "react";
import { Box, VStack, Heading, Text, List, ListItem, Divider, SimpleGrid } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";

export default function EventDetails({
  description,
  additionalDescription,
  organizer,
  attendees,
  eventType,
}: {
  description?: string;
  additionalDescription?: string;
  organizer?: string;
  attendees?: string[];
  eventType?: EventType;
}) {
  const showParticipants =
    eventType === EventType.OTHER || eventType === EventType.TRAINING;

  return (
    <Box w="100%" bgColor="bg" p={4}>
      <VStack align="start" spacing={4}>
        <Box w="100%">
          {description && <Text fontSize="md">{description}</Text>}
          {additionalDescription && <Text color="border.500" mt={2}>{additionalDescription}</Text>}
        </Box>

        <Box w="100%">
          {showParticipants ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
              <Box>
                <Heading size="xs" mb={2}>Organizator</Heading>
                {organizer ? <Text>{organizer}</Text> : <Text color="gray.500">Brak organizatora</Text>}
              </Box>

              <Box>
                <Heading size="xs" mb={2}>Uczestnicy</Heading>
                <List spacing={1}>
                  {attendees && attendees.length > 0 ? (
                    attendees.map((a) => <ListItem key={a}>{a}</ListItem>)
                  ) : (
                    <ListItem color="gray.500">Brak uczestników</ListItem>
                  )}
                </List>
              </Box>
            </SimpleGrid>
          ) : (
            <Box>
              <Heading size="xs" mb={2}>Organizator</Heading>
              {organizer ? <Text>{organizer}</Text> : <Text color="gray.500">Brak organizatora</Text>}
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
