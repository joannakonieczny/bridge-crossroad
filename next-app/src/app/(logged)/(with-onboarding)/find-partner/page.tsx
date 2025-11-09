"use client";

import React from "react";
import { Box, Container, VStack, Text, HStack, Button, Flex } from "@chakra-ui/react";
import MainBar from "@/components/pages/with-onboarding/find-partner/MainBar";
import FiltersBar from "@/components/pages/with-onboarding/find-partner/FiltersBar";

export default function FindParterPage() {
  // mock results (pozostawione tutaj)
  const mockResults = [
    { id: 1, name: "Anna Nowak", note: "Szukam partnera na turnieje" },
    { id: 2, name: "Piotr Kowalski", note: "Chętny na treningi" },
    { id: 3, name: "Maria Wiśniewska", note: "Szukam pary do gry towarzyskiej" },
  ];

  return (
    <Flex direction="column" py="2rem" px="1.25rem" bgColor="border.50" width="100%" minHeight="calc(100vh - 5rem)">
      <VStack spacing={6} align="stretch">
        <MainBar />
        <FiltersBar />
      </VStack>
    </Flex>
  );
}
