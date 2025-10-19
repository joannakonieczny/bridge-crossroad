"use client";
import React from "react";
import { HStack, VStack, Box, Text } from "@chakra-ui/react";

type CalendarEventProps = {
  event: any; // FullCalendar Event object (minimal typing to keep simple)
  timeText?: string;
};

export default function CalendarEvent({ event, timeText }: CalendarEventProps) {
  const title = event.title || "";
  const extended = event.extendedProps || {};
  const description = extended.description || "";

  return (
    <HStack spacing={3} align="flex-start">
      {/* zamiast zdjęcia: box z tłem accent.500 */}
      <Box
        flex="0 0 56px"
        w="56px"
        h="56px"
        borderRadius="md"
        overflow="hidden"
        bg="accent.500"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* opcjonalnie inicjał lub ikona; zostawiam inicjał tytułu */}
        <Text color="white" fontWeight="bold" fontSize="sm" userSelect="none">
          {String(title).charAt(0).toUpperCase() || ""}
        </Text>
      </Box>

      <VStack align="start" spacing={0} maxW="calc(100% - 56px)">
        {timeText ? (
          <Text fontSize="xs" color="whiteAlpha.800">
            {timeText}
          </Text>
        ) : null}
        <Text fontSize="sm" fontWeight="semibold" noOfLines={1} color="white">
          {title}
        </Text>
        {description ? (
          <Text fontSize="xs" color="whiteAlpha.800" noOfLines={2}>
            {description}
          </Text>
        ) : null}
      </VStack>
    </HStack>
  );
}
