import React from "react";
import { Box, VStack, Heading, Text, List, ListItem, Divider, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";

function displayName(val: any) {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.nickname ?? `${val.firstName ?? ""} ${val.lastName ?? ""}`.trim() ?? val.name ?? val.id ?? "";
}

export default function EventDetails({
  description,
  additionalDescription,
  organizer,
  attendees,
  eventType,
  loading,
}: {
  description?: string;
  additionalDescription?: string;
  organizer?: any; // string or populated
  attendees?: any[]; // array of strings or populated
  eventType?: EventType;
  loading?: boolean;
}) {
  const showParticipants =
    eventType === EventType.OTHER || eventType === EventType.TRAINING;

  return (
    <Box w="100%" bgColor="bg" p={4}>
      <VStack align="start" spacing={4}>
        <Box w="100%">
          {loading ? (
            <>
              <Skeleton height="18px" mb={2} />
              <Skeleton height="14px" w="60%" />
            </>
          ) : (
            <>
              {description && <Text fontSize="md">{description}</Text>}
              {additionalDescription && <Text color="border.500" mt={2}>{additionalDescription}</Text>}
            </>
          )}
        </Box>

        <Box w="100%">
          {showParticipants ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
              <Box>
                <Heading size="xs" mb={2}>Organizator</Heading>
                {loading ? <Skeleton height="14px" w="50%" /> : organizer ? <Text>{displayName(organizer)}</Text> : <Text color="gray.500">Brak organizatora</Text>}
              </Box>

              <Box>
                <Heading size="xs" mb={2}>Uczestnicy</Heading>
                {loading ? (
                  <Skeleton height="80px" />
                ) : (
                  <List spacing={1}>
                    {attendees && attendees.length > 0 ? (
                      attendees.map((a) => <ListItem key={typeof a === "string" ? a : a.id ?? displayName(a)}>{displayName(a)}</ListItem>)
                    ) : (
                      <ListItem color="gray.500">Brak uczestników</ListItem>
                    )}
                  </List>
                )}
              </Box>
            </SimpleGrid>
          ) : (
            <Box>
              <Heading size="xs" mb={2}>Organizator</Heading>
              {loading ? <Skeleton height="14px" w="50%" /> : organizer ? <Text>{displayName(organizer)}</Text> : <Text color="gray.500">Brak organizatora</Text>}
            </Box>
          )}
        </Box>

        <Divider />
      </VStack>
    </Box>
  );
}
