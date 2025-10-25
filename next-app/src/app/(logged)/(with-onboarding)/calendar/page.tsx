"use client";
import Calendar from "@/components/pages/with-onboarding/calendar/calendar-content/Calendar";
import { Flex, Box, Button, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();
  const showButton = useBreakpointValue({ base: true, md: false }) ?? false;

  return (
    <Flex align="stretch" minH="calc(100vh - 6rem)">
      <Box flex="1" p={4}>
        {showButton && (
          <Box mb={4} px={4}>
            <Button w="100%" variant="outline" colorScheme="accent" onClick={() => router.push("calendar/upcoming-events/")}>
              Zobacz nadchodzące wydarzenia
            </Button>
          </Box>
        )}

        <Calendar />
      </Box>
    </Flex>
  );
}
