"use client";

import { Box, Flex, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { EventType } from "@/club-preset/event-type";
import EventBanner from "@/components/pages/with-onboarding/calendar/event-page/EventBanner";
import EventDetails from "@/components/pages/with-onboarding/calendar/event-page/EventDetails";
import EventSpecificData from "@/components/pages/with-onboarding/calendar/event-page/EventSpecificData";
import EventEnrollment from "@/components/pages/with-onboarding/calendar/event-page/EventEnrollment";
import BackLink from "@/components/common/BackLink";
import { useTranslations } from "@/lib/typed-translations";
import { useEventQuery } from "@/lib/queries";

export default function EventPage() {
  const t = useTranslations("pages.EventPage.page");
  const params = useParams<{ id?: string }>();
  const eventId = params?.id || null;

  const eventQ = useEventQuery(eventId);

  const isLoading = eventQ.isLoading;

  return (
    <Flex
      align="stretch"
      height="calc(100vh - 5rem)"
      bgColor={"border.50"}
      overflowY="auto"
    >
      <Box maxW="920px" w="100%" mx="auto">
        <Box pt={4} pb={2} pl={4}>
          <BackLink>{t("backLink")}</BackLink>
        </Box>
        <VStack spacing="2rem" align="stretch" pb={8}>
          <EventBanner event={eventQ.data} loading={isLoading} />
          {(eventQ.data?.data?.type === EventType.TOURNAMENT ||
            eventQ.data?.data?.type === EventType.OTHER) && (
            <EventEnrollment eventType={eventQ.data?.data?.type} />
          )}

          <EventDetails event={eventQ.data} loading={isLoading} />
          <EventSpecificData
            eventData={eventQ.data?.data}
            loading={isLoading}
          />
        </VStack>
      </Box>
    </Flex>
  );
}
