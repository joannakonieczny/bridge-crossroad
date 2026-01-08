"use client";

import React from "react";
import { VStack, Flex } from "@chakra-ui/react";
import FiltersBar from "@/components/pages/with-onboarding/find-partner/FiltersBar";
import AnnouncementsList from "@/components/pages/with-onboarding/find-partner/AnnouncementsList";
import PaginationControls from "@/components/pages/with-onboarding/find-partner/PaginationControls";

export default function FindPartnerPage() {
  return (
    <Flex
      direction="column"
      py="2rem"
      px="1.25rem"
      bgColor="neutral.50"
      width="100%"
      minHeight="calc(100vh - 5rem)"
    >
      <VStack spacing={6} align="stretch">
        <FiltersBar />
        <AnnouncementsList />
        <PaginationControls />
      </VStack>
    </Flex>
  );
}
