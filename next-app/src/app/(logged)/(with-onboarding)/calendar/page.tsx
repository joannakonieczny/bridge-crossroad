"use client";
import { FullPageLoadingSpinner } from "@/components/common/LoadingSpinner";
import { useTranslations } from "@/lib/typed-translations";
import { ROUTES } from "@/routes";
import { Flex, Box, Button, useBreakpointValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Calendar = dynamic(
  () =>
    import(
      "@/components/pages/with-onboarding/calendar/calendar-content/Calendar"
    ),
  { loading: () => <FullPageLoadingSpinner /> }
);

export default function CalendarPage() {
  const router = useRouter();
  const showButton = useBreakpointValue({ base: true, md: false }) ?? false;
  const t = useTranslations("pages.CalendarPage");

  return (
    <Flex align="stretch" minH="calc(100vh - 5rem)">
      <Box flex="1" p={4}>
        {showButton && (
          <Box mb={4} px={4}>
            <Button
              w="100%"
              variant="outline"
              colorScheme="accent"
              onClick={() => router.push(ROUTES.calendar.upcoming_events)}
            >
              {t("showUpcomingEventsButton")}
            </Button>
          </Box>
        )}

        <Calendar />
      </Box>
    </Flex>
  );
}
