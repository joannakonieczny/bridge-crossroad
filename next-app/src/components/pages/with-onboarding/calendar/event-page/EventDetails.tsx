import React from "react";
import {
  Box,
  VStack,
  List,
  ListItem,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { useTranslations } from "@/lib/typed-translations";
import { EventType } from "@/club-preset/event-type";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { getPersonLabel } from "@/util/formatters";
import type { EventSchemaTypePopulated } from "@/schemas/model/event/event-types";

export default function EventDetails({
  event,
  loading,
}: {
  event?: EventSchemaTypePopulated;
  loading?: boolean;
}) {
  const t = useTranslations("components.EventPage.EventDetails");
  const showParticipants =
    event?.data.type === EventType.OTHER ||
    event?.data.type === EventType.TRAINING;

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
              {event?.description && (
                <ResponsiveText fontSize="md">
                  {event.description}
                </ResponsiveText>
              )}
              {event?.additionalDescription && (
                <ResponsiveText color="border.500" fontSize="sm" mt={2}>
                  {event.additionalDescription}
                </ResponsiveText>
              )}
            </>
          )}
        </Box>

        <Box w="100%">
          {showParticipants ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
              <Box>
                {!loading && (
                  <ResponsiveHeading
                    text={t("organizer")}
                    fontSize="sm"
                    barOrientation="horizontal"
                  />
                )}
                {loading ? (
                  <Skeleton height="14px" w="50%" />
                ) : (
                  <ResponsiveText>
                    {getPersonLabel(event.organizer)}
                  </ResponsiveText>
                )}
              </Box>

              <Box>
                <ResponsiveHeading
                  text={t("participants")}
                  fontSize="sm"
                  barOrientation="horizontal"
                />
                {loading ? (
                  <Skeleton height="80px" />
                ) : (
                  <List spacing={1}>
                    {event?.attendees && event.attendees.length > 0 ? (
                      event.attendees.map((a, idx) => (
                        <ListItem key={idx}>
                          <ResponsiveText as="span">
                            {getPersonLabel(a)}
                          </ResponsiveText>
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ResponsiveText color="border.500">
                          {t("noParticipants")}
                        </ResponsiveText>
                      </ListItem>
                    )}
                  </List>
                )}
              </Box>
            </SimpleGrid>
          ) : !loading ? (
            <Box>
              <ResponsiveHeading
                text={t("organizer")}
                fontSize="sm"
                barOrientation="horizontal"
              />
              <ResponsiveText>
                {getPersonLabel(event?.organizer)}
              </ResponsiveText>
            </Box>
          ) : null}
        </Box>
      </VStack>
    </Box>
  );
}
