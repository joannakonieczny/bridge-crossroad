"use client";

import React from "react";
import { Box, Container, VStack, Text, HStack, Button, Flex } from "@chakra-ui/react";
import MainBar from "@/components/pages/with-onboarding/find-partner/MainBar";
import FiltersBar from "@/components/pages/with-onboarding/find-partner/FiltersBar";
import AnnoucmentsList from "@/components/pages/with-onboarding/find-partner/AnnoucmentsList";
import PaginationControls from "@/components/pages/with-onboarding/find-partner/PaginationControls";

export default function FindParterPage() {

  return (
    <Flex direction="column" py="2rem" px="1.25rem" bgColor="border.50" width="100%" minHeight="calc(100vh - 5rem)">
      <VStack spacing={6} align="stretch">
        <MainBar />
        <FiltersBar />
        <AnnoucmentsList />
        <PaginationControls />
      </VStack>
    </Flex>
  );
}
