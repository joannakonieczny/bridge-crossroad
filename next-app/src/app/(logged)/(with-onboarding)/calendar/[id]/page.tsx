"use client";

import { Box, Flex, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventType } from "@/club-preset/event-type";
import EventBanner from "@/components/pages/with-onboarding/calendar/event-page/EventBanner";
import EventDetails from "@/components/pages/with-onboarding/calendar/event-page/EventDetails";
import EventSpecificData from "@/components/pages/with-onboarding/calendar/event-page/EventSpecificData";
import EventEnrollment from "@/components/pages/with-onboarding/calendar/event-page/EventEnrollment";
import BackLink from "@/components/common/BackLink";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { getEvent } from "@/services/events/api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { EventIdType } from "@/schemas/model/event/event-types";
import { useTranslations } from "@/lib/typed-translations";

export default function EventPage() {
  const t = useTranslations("pages.EventPage.page");
  const params = useParams() as { id?: string } | undefined;
  const eventId = params?.id;

  const eventQ = useActionQuery({
    queryKey: [QUERY_KEYS.event, eventId ?? "none"],
    action: () => getEvent({ eventId: eventId as EventIdType }),
    enabled: !!eventId,
  });

  const toast = useToast();
  const router = useRouter();
  const errorShownRef = useRef(false);

  useEffect(() => {
    if (eventQ.data) {
      // eslint-disable-next-line no-console
      console.log("Loaded event:", eventQ.data);
    }

    if (eventQ.error && !errorShownRef.current) {
      errorShownRef.current = true;

      // show error toast (Polish) and redirect to /calendar
      toast({
        title: t("toast.loadError.title"),
        description: t("toast.loadError.description"),
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });

      // push to calendar (no delay needed; toast persists across routes)
      router.push("/calendar");

      // eslint-disable-next-line no-console
      console.error("Failed to load event:", eventQ.error);
    }
  }, [eventQ.data, eventQ.error, toast, router, t]);

  const isLoading = eventQ.isLoading;

  return (
    <Flex align="stretch" height="calc(100vh - 5rem)" bgColor={"border.50"} overflowY="auto">
      <Box maxW="920px" w="100%" mx="auto">
        {/* Back link above all content */}
        <Box pt={4} pb={2} pl={4}>
          <BackLink>{t("backLink")}</BackLink>
        </Box>

        {/* oba komponenty na całą szerokość, oddzielone 2rem gapu */}
        <VStack spacing="2rem" align="stretch" pb={8}>
          <EventBanner
            title={eventQ.data?.title}
            imageUrl={"https://picsum.photos/id/237/200/300"}
            group={eventQ.data?.group}
            location={eventQ.data?.location}
            duration={eventQ.data?.duration}
            loading={isLoading}
          />

          {/* Enrollment: tylko gdy mamy określony typ (żadnych mocków podczas loading/error) */}
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

          {/* event-specific data is rendered at page level with 2rem gap from details */}
          <EventSpecificData eventType={eventQ.data?.data?.type} eventData={eventQ.data?.data} loading={isLoading} />
        </VStack>
      </Box>
    </Flex>
  );
}
