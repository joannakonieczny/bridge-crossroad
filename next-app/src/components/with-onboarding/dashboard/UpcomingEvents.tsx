"use client";

import { Box, HStack, IconButton, Text, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const contests = [
  { name: "Turniej 1", date: "1 stycznia" },
  { name: "Turniej 2", date: "2 lutego" },
  { name: "Turniej 3", date: "3 marca" },
  { name: "Turniej 4", date: "4 kwietnia" },
  { name: "Turniej 5", date: "5 maja" },
];

const ITEMS_PER_PAGE = 2;

export default function CarouselList() {
  const [startIndex, setStartIndex] = useState(0);

  const showPrev = () => {
    setStartIndex((prev) => Math.max(prev - ITEMS_PER_PAGE, 0));
  };

  const showNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, contests.length - ITEMS_PER_PAGE)
    );
  };

  const visibleItems = contests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Flex direction="column" width="100%">
    <Text fontSize="24px" lineHeight="24px" fontWeight="bold" mb={4}>Nadchodzące wydarzenia</Text>
    <HStack align="center" spacing={4} width="100%">

        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Poprzednie"
          onClick={showPrev}
          isDisabled={startIndex === 0}
        />
        
      <HStack spacing={8} width="100%">
        {visibleItems.map((contest, i) => (
          <Box
            key={i}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            //width="300px"
            width="100%"
          >
            <Text fontWeight="bold">{contest.name}</Text>
            <Text color="gray.500">{contest.date}</Text>
          </Box>
        ))}
      </HStack>

      <IconButton
          icon={<ChevronRightIcon />}
          aria-label="Następne"
          onClick={showNext}
          isDisabled={startIndex + ITEMS_PER_PAGE >= contests.length}
        />

    </HStack>
    </Flex>
  );
}
