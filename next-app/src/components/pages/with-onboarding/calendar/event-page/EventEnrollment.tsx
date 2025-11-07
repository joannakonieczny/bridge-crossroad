"use client";

import React, { useState } from "react";
import { Box, VStack, Input, Button, SimpleGrid } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import { useTranslations } from "@/lib/typed-translations";

export default function EventEnrollment({ eventType }: { eventType?: EventType }) {
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const t = useTranslations("components.EventPage.EventEnrollment");

  const buttonLabel =
    eventType === EventType.TOURNAMENT ? t("button.tournament") : t("button.event");

  return (
    <Box bg="white" borderRadius="md" boxShadow="sm" p={4} w="100%">
      <VStack align="start" spacing={4}>
        <ResponsiveHeading text={t("heading")} fontSize="sm" barOrientation="horizontal" />
        {eventType === EventType.TOURNAMENT ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w="100%">
            <Input
              placeholder={t("placeholder.playerA")}
              value={playerA}
              onChange={(e) => setPlayerA(e.target.value)}
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "sm", md: "md" }}
              _placeholder={{ fontSize: { base: "sm", md: "md" } }}
            />
            <Input
              placeholder={t("placeholder.playerB")}
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
          fontSize={{ base: "sm", md: "md" }}
          py={{ base: 2, md: 3 }}
        >
          {buttonLabel}
        </Button>
      </VStack>
    </Box>
  );
}
