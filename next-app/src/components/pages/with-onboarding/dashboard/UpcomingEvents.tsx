"use client";

import { Box, HStack, IconButton, Text, Flex } from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SidebarCard from "@/components/common/SidebarCard";
import { useRecentEventsQuery } from "@/lib/queries";
import { ROUTES } from "@/routes";

const ITEMS_PER_PAGE = 2;

export default function UpcomingEvents() {
  const [startIndex, setStartIndex] = useState(0);
  const t = useTranslations("pages.DashboardPage.headings");

  const eventsQ = useRecentEventsQuery(6);
  const events = eventsQ.data ?? [];

  const showPrev = () => {
    setStartIndex((prev) => Math.max(prev - ITEMS_PER_PAGE, 0));
  };

  const showNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, Math.max(0, events.length - ITEMS_PER_PAGE))
    );
  };

  const visibleItems = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Flex direction="column" width="100%">
      <Text fontSize="24px" lineHeight="24px" fontWeight="bold" mb={4}>
        {t("upcomingEvents")}
      </Text>
      <HStack align="center" spacing={4} width="100%">
        <IconButton
          icon={<FaChevronLeft />}
          aria-label="Previous"
          onClick={showPrev}
          isDisabled={startIndex === 0}
        />

        <HStack spacing={8} width="100%">
          {visibleItems.map((event) => (
            <Box key={event.id} width="100%">
              <SidebarCard
                title={event.title}
                imageUrl={event.imageUrl}
                href={ROUTES.calendar.eventDetails(event.id)}
              />
            </Box>
          ))}
        </HStack>

        <IconButton
          icon={<FaChevronRight />}
          aria-label="Next"
          onClick={showNext}
          isDisabled={events.length <= ITEMS_PER_PAGE || startIndex + ITEMS_PER_PAGE >= events.length}
        />
      </HStack>
    </Flex>
  );
}
