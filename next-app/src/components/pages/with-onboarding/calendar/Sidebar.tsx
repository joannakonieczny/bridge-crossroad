"use client";

import React from "react";
import {
  Box,
  VStack,
  Button,
  useDisclosure,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import SidebarCard from "@/components/common/SidebarCard";
import { FiPlus } from "react-icons/fi";
import { useTranslations } from "@/lib/typed-translations";
import EventForm from "./event-form/EventForm";
import { useRecentEventsQuery } from "@/lib/queries";
import { ROUTES } from "@/routes";

const EventsToDisplay = 4;

export default function Sidebar() {
  const t = useTranslations("pages.CalendarPage.Sidebar");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isVisible = useBreakpointValue({ base: false, md: true }) ?? false;
  const { colorMode } = useColorMode();

  const eventsQ = useRecentEventsQuery(EventsToDisplay);

  if (!isVisible) return null;

  return (
    <Box
      w="16.5rem"
      minH="calc(100vh - 5rem)"
      bg={colorMode === "dark" ? "neutral.100" : "neutral.50"}
      flex="0 0 16.5rem"
      p={4}
      overflowY="auto"  
      position="relative"
    >
      <Box mb={4} width="100%" pr={2}>
        <Button
          w="100%"
          size="sm"
          color="bg"
          bg="accent.500"
          _hover={{ bg: "accent.600" }}
          rightIcon={<FiPlus size={30} />}
          onClick={onOpen}
        >
          {t("addEvent")}
        </Button>
      </Box>

      <VStack spacing={4} align="stretch">
        {eventsQ.data?.map((event) => (
          <SidebarCard
            key={event.title}
            title={event.title}
            imageUrl={event.imageUrl}
            href={ROUTES.calendar.eventDetails(event.id)}
          />
        ))}
      </VStack>
      <EventForm isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
