"use client";

import React from "react";
import { VStack, Flex } from "@chakra-ui/react";
import MainBar from "@/components/pages/with-onboarding/find-partner/MainBar";
import FiltersBar from "@/components/pages/with-onboarding/find-partner/FiltersBar";
import AnnoucementsList from "@/components/pages/with-onboarding/find-partner/AnnoucementsList";
import PaginationControls from "@/components/pages/with-onboarding/find-partner/PaginationControls";


export default function FindParnerPage() {

  return (
    <Flex direction="column" py="2rem" px="1.25rem" bgColor="border.50" width="100%" minHeight="calc(100vh - 5rem)">
      <VStack spacing={6} align="stretch">
        <MainBar />
        <FiltersBar />
        <AnnoucementsList />
        <PaginationControls />
      </VStack>
    </Flex>
  );
}
