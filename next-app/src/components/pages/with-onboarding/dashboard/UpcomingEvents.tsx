"use client";

import {
  Box,
  HStack,
  IconButton,
  Flex,
  useBreakpointValue,
  Skeleton,
} from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SidebarCard from "@/components/common/SidebarCard";
import { useRecentEventsQuery } from "@/lib/queries";
import { ROUTES } from "@/routes";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";

export default function UpcomingEvents() {
  const [startIndex, setStartIndex] = useState(0);
  const t = useTranslations("pages.DashboardPage.headings");
  const itemsPerPage = useBreakpointValue({ base: 1, md: 2, "2xl": 3 }) ?? 1;

  const eventsQ = useRecentEventsQuery(6);
  const loading = eventsQ.isLoading;
  const events = eventsQ.data ?? [];

  const showPrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const showNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + itemsPerPage, Math.max(0, events.length - itemsPerPage))
    );
  };

  const visibleItems = events.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Flex direction="column" width="100%">
      <ResponsiveHeading text={t("upcomingEvents")} fontSize="xl" mb={4} />
      <HStack align="center" width="100%" justifyContent="space-between">
        <IconButton
          icon={<FaChevronLeft />}
          aria-label="Previous"
          onClick={showPrev}
          isDisabled={startIndex === 0 || loading}
        />

        <HStack spacing={4}>
          {loading
            ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                <Box key={idx} width="100%">
                  <Skeleton height="12rem" borderRadius="md" />
                </Box>
              ))
            : visibleItems.map((event) => (
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
          isDisabled={
            loading ||
            events.length <= itemsPerPage ||
            startIndex + itemsPerPage >= events.length
          }
        />
      </HStack>
    </Flex>
  );
}
