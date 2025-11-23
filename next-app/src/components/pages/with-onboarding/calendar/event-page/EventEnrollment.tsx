"use client";

import {
  Box,
  VStack,
  Button,
  HStack,
  Text,
  Avatar,
  AvatarGroup,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import type { EventSchemaTypePopulated } from "@/schemas/model/event/event-types";
import { getPersonLabel } from "@/util/formatters";
import { addAttendee } from "@/services/events/api";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { useQueryClient } from "@tanstack/react-query";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";

type EventEnrollmentProps = {
  event: EventSchemaTypePopulated;
};

export default function EventEnrollment({ event }: EventEnrollmentProps) {
  const participants = event.attendees;
  const eventId = event.id;
  const isEnrolled = event.isAttending ?? false;
  const participantsCount = participants.length;

  const t = useTranslations("pages.EventPage.EventEnrollment");
  const tValidation = useTranslationsWithFallback();

  const querryClient = useQueryClient();
  const toast = useToast();

  const enrollMutation = useActionMutation({
    action: () => {
      const promise = addAttendee({ eventId, groupId: event.group.id });
      toast.promise(promise, {
        loading: { title: t("enroll.toast.loading") },
        success: { title: t("enroll.toast.success") },
        error: (err: MutationOrQuerryError<typeof addAttendee>) => {
          const errKey = getMessageKeyFromError(err, {
            generalErrorKey:
              "pages.EventPage.EventEnrollment.enroll.toast.errorDefault",
          });
          return { title: tValidation(errKey) };
        },
      });
      return promise;
    },
    onSuccess: () => {
      querryClient.invalidateQueries({
        queryKey: ["event"],
      });
    },
  });

  return (
    <Box bg="bg" borderRadius="md" boxShadow="sm" p={4} w="100%">
      <VStack align="start" spacing={4}>
        <ResponsiveHeading
          text={t("heading")}
          fontSize="sm"
          barOrientation="horizontal"
        />

        <HStack spacing={4} w="100%" align="center" justify="space-between">
          <HStack spacing={3} align="center">
            {participantsCount && (
              <AvatarGroup size="sm" max={4}>
                {participants.slice(0, 4).map((p, i) => {
                  return <Avatar key={i} name={getPersonLabel(p)} />;
                })}
              </AvatarGroup>
            )}
            <VStack spacing={0} align="start">
              <Text fontWeight="semibold">
                {participantsCount
                  ? t("participantsCount.many", { count: participantsCount })
                  : t("participantsCount.none")}
              </Text>
            </VStack>
          </HStack>
        </HStack>

        {isEnrolled ? (
          <Button
            leftIcon={<Icon as={FaUserMinus} />}
            colorScheme="red"
            variant="outline"
            w="100%"
            fontSize={{ base: "sm", md: "md" }}
          >
            {t("unenroll.button")}
          </Button>
        ) : (
          <Button
            leftIcon={<Icon as={FaUserPlus} />}
            colorScheme="accent"
            variant="solid"
            w="100%"
            onClick={() => {
              enrollMutation.mutateAsync({});
            }}
            fontSize={{ base: "sm", md: "md" }}
          >
            {t("enroll.button")}
          </Button>
        )}
      </VStack>
    </Box>
  );
}
