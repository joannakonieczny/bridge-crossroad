"use client";

import React, { useState } from "react";
import { Box, VStack, Heading, Text, Input, Button, SimpleGrid } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";

export default function EventEnrollment({ eventType }: { eventType?: EventType }) {
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");

  // label zależny od typu (dla turnieju inna etykieta)
  const buttonLabel =
    eventType === EventType.TOURNAMENT ? "Zapisz się na turniej" : "Zapisz się na wydarzenie";

  return (
    <Box bg="white" borderRadius="md" boxShadow="sm" p={4} w="100%">
      <VStack align="start" spacing={4}>
        <Heading size="sm">Zapisz się na wydarzenie</Heading>

        {/* jeśli typ turniej — pola na dwóch graczy pary */}
        {eventType === EventType.TOURNAMENT ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w="100%">
            <Input
              placeholder="Gracz A"
              value={playerA}
              onChange={(e) => setPlayerA(e.target.value)}
            />
            <Input
              placeholder="Gracz B"
              value={playerB}
              onChange={(e) => setPlayerB(e.target.value)}
            />
          </SimpleGrid>
        ) : null}

        <Button w="100%" colorScheme="accent" variant="solid" onClick={() => { /* noop for now */ }}>
          {buttonLabel}
        </Button>
      </VStack>
    </Box>
  );
}
