"use client";

import { Box, Flex, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import EventBanner from "@/components/pages/with-onboarding/calendar/event-page/EventBanner";
import EventDetails from "@/components/pages/with-onboarding/calendar/event-page/EventDetails";
import EventSpecificData from "@/components/pages/with-onboarding/calendar/event-page/EventSpecificData";
import EventEnrollment from "@/components/pages/with-onboarding/calendar/event-page/EventEnrollment";
import EventPairsTournamentEnrollment from "@/components/pages/with-onboarding/calendar/event-page/EventPairsTournamentEnrollment";
import BackLink from "@/components/common/BackLink";
import { useTranslations } from "@/lib/typed-translations";
import { useEventQuery } from "@/lib/queries";
import { EventType } from "@/club-preset/event-type";
import EventTeamsTournamentEnrollment from "@/components/pages/with-onboarding/calendar/event-page/EventTeamsTournamentEnrollment";

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
      bgColor={"neutral.50"}
      overflowY="auto"
    >
      <Box maxW="920px" w="100%" mx="auto">
        <Box pt={4} pb={2} pl={4}>
          <BackLink>{t("backLink")}</BackLink>
        </Box>
        <VStack spacing="2rem" align="stretch" pb={8}>
          <EventBanner event={eventQ.data} loading={isLoading} />
          <EventDetails event={eventQ.data} loading={isLoading} />
          {eventQ.data && <EventEnrollment event={eventQ.data} />}
          {eventQ.data &&
            eventQ.data.data.type === EventType.TOURNAMENT_PAIRS && (
              <EventPairsTournamentEnrollment event={eventQ.data} />
            )}
          {eventQ.data &&
            eventQ.data.data.type === EventType.TOURNAMENT_TEAMS && (
              <EventTeamsTournamentEnrollment event={eventQ.data} />
            )}
          <EventSpecificData
            eventData={eventQ.data?.data}
            loading={isLoading}
          />
        </VStack>
      </Box>
    </Flex>
  );
}
