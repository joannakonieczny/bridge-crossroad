"use client";

import React, { useState } from "react";
import { Box, VStack, Input, Button, SimpleGrid } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";

export default function EventEnrollment({ eventType }: { eventType?: EventType }) {
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");

  // label zależny od typu (dla turnieju inna etykieta)
  const buttonLabel =
    eventType === EventType.TOURNAMENT ? "Zapisz się na turniej" : "Zapisz się na wydarzenie";

  return (
    <Box bg="white" borderRadius="md" boxShadow="sm" p={4} w="100%">
      <VStack align="start" spacing={4}>
        <ResponsiveHeading text="Zapisy" fontSize="sm" barOrientation="horizontal" />
        <ResponsiveText color="gray.600" fontSize="sm">
          Kliknij przycisk, aby zapisać swój udział. (Funkcja zapisu jeszcze niezaimplementowana)
        </ResponsiveText>

        {/* jeśli typ turniej — pola na dwóch graczy pary */}
        {eventType === EventType.TOURNAMENT ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w="100%">
            <Input
              placeholder="Gracz A (id lub nick)"
              value={playerA}
              onChange={(e) => setPlayerA(e.target.value)}
              // responsive visual size and placeholder font
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "sm", md: "md" }}
              _placeholder={{ fontSize: { base: "sm", md: "md" } }}
            />
            <Input
              placeholder="Gracz B (id lub nick)"
              value={playerB}
              onChange={(e) => setPlayerB(e.target.value)}
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "sm", md: "md" }}
              _placeholder={{ fontSize: { base: "sm", md: "md" } }}
            />
          </SimpleGrid>
        ) : null}

        <Button
          w="100%"
          colorScheme="accent"
          variant="solid"
          onClick={() => { /* noop for now */ }}
          // responsive typography & padding so label scales on small screens
          fontSize={{ base: "sm", md: "md" }}
          py={{ base: 2, md: 3 }}
        >
          {buttonLabel}
        </Button>
      </VStack>
    </Box>
  );
}
