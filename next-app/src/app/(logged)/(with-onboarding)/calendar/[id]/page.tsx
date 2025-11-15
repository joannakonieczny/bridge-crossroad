"use client";

import { Box, Flex, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { EventType } from "@/club-preset/event-type";
import EventBanner from "@/components/pages/with-onboarding/calendar/event-page/EventBanner";
import EventDetails from "@/components/pages/with-onboarding/calendar/event-page/EventDetails";
import EventSpecificData from "@/components/pages/with-onboarding/calendar/event-page/EventSpecificData";
import EventEnrollment from "@/components/pages/with-onboarding/calendar/event-page/EventEnrollment";
import BackLink from "@/components/common/BackLink";
import { useEventPageQuery } from "@/lib/queries";
import { useTranslations } from "@/lib/typed-translations";

export default function EventPage() {
  const t = useTranslations("pages.EventPage.page");
  const params = useParams() as { id?: string } | undefined;
  const eventId = params?.id;

  const eventQ = useEventPageQuery(eventId);

  const isLoading = eventQ.isLoading;

  return (
    <Flex align="stretch" height="calc(100vh - 5rem)" bgColor={"border.50"} overflowY="auto">
      <Box maxW="920px" w="100%" mx="auto">
        <Box pt={4} pb={2} pl={4}>
          <BackLink>{t("backLink")}</BackLink>
        </Box>
        <VStack spacing="2rem" align="stretch" pb={8}>
          <EventBanner
            title={eventQ.data?.title}
            imageUrl={"https://picsum.photos/id/237/200/300"} //tymczasowe
            group={eventQ.data?.group}
            location={eventQ.data?.location}
            duration={eventQ.data?.duration}
            loading={isLoading}
          />
          {(eventQ.data?.data?.type === EventType.TOURNAMENT || eventQ.data?.data?.type === EventType.OTHER) && (
            <EventEnrollment eventType={eventQ.data?.data?.type} />
          )}

          <EventDetails
            description={eventQ.data?.description}
            additionalDescription={eventQ.data?.additionalDescription}
            organizer={eventQ.data?.organizer}
            attendees={eventQ.data?.attendees}
            eventType={eventQ.data?.data?.type}
            loading={isLoading}
          />
          <EventSpecificData eventType={eventQ.data?.data?.type} eventData={eventQ.data?.data} loading={isLoading} />
        </VStack>
      </Box>
    </Flex>
  );
}
