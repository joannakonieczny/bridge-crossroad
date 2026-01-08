"use client";
import { FullPageLoadingSpinner } from "@/components/common/LoadingSpinner";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const Calendar = dynamic(
  () =>
    import(
      "@/components/pages/with-onboarding/calendar/calendar-content/Calendar"
    ),
  { loading: () => <FullPageLoadingSpinner /> }
);

export default function CalendarPage() {
  const bgColor = useColorModeValue("neutral.50", "bg");
  return (
    <Flex align="stretch" minH="calc(100vh - 5rem)" bgColor={bgColor}>
      <Box flex="1" p={4}>
        <Calendar />
      </Box>
    </Flex>
  );
}
