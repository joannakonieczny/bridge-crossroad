import Calendar from "@/components/pages/with-onboarding/calendar/calendar-content/Calendar";
import { Flex, Box } from "@chakra-ui/react";

export default function CalendarPage() {
  return (
    <Flex align="stretch" minH="calc(100vh - 6rem)">
      <Box flex="1">
        <Calendar />
      </Box>
    </Flex>
  );
}
