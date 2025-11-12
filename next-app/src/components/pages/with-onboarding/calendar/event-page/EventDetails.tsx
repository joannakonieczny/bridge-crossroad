import React from "react";
import { Box, VStack, List, ListItem, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import { EventType } from "@/club-preset/event-type";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { displayName } from "@/util/user";
import { UserTypeBasic } from "@/schemas/model/user/user-types";

export default function EventDetails({
  description,
  additionalDescription,
  organizer,
  attendees,
  eventType,
  loading,
}: {
  description?: string;
  additionalDescription?: string;
  organizer?: UserTypeBasic;
  attendees?: UserTypeBasic[];
  eventType?: EventType;
  loading?: boolean;
}) {
  const t = useTranslations("components.EventPage.EventDetails");
  const showParticipants =
    eventType === EventType.OTHER || eventType === EventType.TRAINING;
  
  return (
    <Box w="100%" bgColor="bg" p={4}>
      <VStack align="start" spacing={4}>
        <Box w="100%">
          {loading ? (
            <>
              <Skeleton height="18px" mb={2} />
              <Skeleton height="14px" w="60%" />
            </>
          ) : (
            <>
              {description && <ResponsiveText fontSize="md">{description}</ResponsiveText>}
              {additionalDescription && <ResponsiveText color="border.500" fontSize="sm" mt={2}>{additionalDescription}</ResponsiveText>}
            </>
          )}
        </Box>

        <Box w="100%">
          {showParticipants ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
              <Box>
                {!loading && <ResponsiveHeading text={t("organizer")} fontSize="sm" barOrientation="horizontal" />}
                {loading ? <Skeleton height="14px" w="50%" /> : organizer ? <ResponsiveText>{displayName(organizer)}</ResponsiveText> : <ResponsiveText color="gray.500">{t("noOrganizer")}</ResponsiveText>}
              </Box>

              <Box>
                <ResponsiveHeading text={t("participants")} fontSize="sm" barOrientation="horizontal" />
                {loading ? (
                  <Skeleton height="80px" />
                ) : (
                  <List spacing={1}>
                    {attendees && attendees.length > 0 ? (
                      attendees.map((a) => <ListItem key={typeof a === "string" ? a : a.id ?? displayName(a)}><ResponsiveText as="span">{displayName(a)}</ResponsiveText></ListItem>)
                    ) : (
                      <ListItem><ResponsiveText color="gray.500">{t("noParticipants")}</ResponsiveText></ListItem>
                    )}
                  </List>
                )}
              </Box>
            </SimpleGrid>
          ) : (
            <Box>
              {!loading && <ResponsiveHeading text={t("organizer")} fontSize="sm" barOrientation="horizontal" />}
              {loading ? null : organizer ? <ResponsiveText>{displayName(organizer)}</ResponsiveText> : <ResponsiveText color="gray.500">{t("noOrganizer")}</ResponsiveText>}
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
