"use client";

import { Box, VStack, Button, Icon, useToast } from "@chakra-ui/react";
import { FaUserPlus } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import type {
  EventSchemaTypePopulated,
  TournamentPairsDataTypePopulated,
} from "@/schemas/model/event/event-types";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import { useGroupQuery, useUserInfoQuery } from "@/lib/queries";
import { getPersonLabel } from "@/util/formatters";
import { enrollToEventTournament } from "@/services/events/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { withEmptyToUndefined } from "@/schemas/common";
import SelectInput from "@/components/common/form/SelectInput";
import { useMemo } from "react";
import { EventType } from "@/club-preset/event-type";

type EventPairsTournamentEnrollmentProps = {
  event: EventSchemaTypePopulated;
};

const formSchema = z.object({
  partnerId: z.string().nonempty(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function EventPairsTournamentEnrollment({
  event,
}: EventPairsTournamentEnrollmentProps) {
  const t = useTranslations("pages.EventPage.EventPairsTournamentEnrollment");
  const tValidation = useTranslationsWithFallback();

  const {
    handleSubmit: handleFormSubmit,
    control: formControl,
    reset,
  } = useForm({
    resolver: zodResolver(withEmptyToUndefined(formSchema)),
  });

  const querryClient = useQueryClient();
  const toast = useToast();

  const userInfoQ = useUserInfoQuery();
  const groupQ = useGroupQuery(event.group.id);

  const currentUserId = userInfoQ.data?.id;

  const isUserEnrolled = useMemo(() => {
    if (!currentUserId || event.data.type !== EventType.TOURNAMENT_PAIRS)
      return false;

    const pairs =
      (event.data as TournamentPairsDataTypePopulated).contestantsPairs ?? [];

    return pairs.some(
      (pair) =>
        pair.first.id === currentUserId || pair.second.id === currentUserId
    );
  }, [currentUserId, event.data]);

  const availablePartners = useMemo(() => {
    if (!groupQ.data || !currentUserId) return [];
    if (event.data.type !== EventType.TOURNAMENT_PAIRS) return [];

    const members = groupQ.data.members;
    const pairs =
      (event.data as TournamentPairsDataTypePopulated).contestantsPairs ?? [];

    return members
      .filter((m) => {
        const isPaired = pairs.some(
          (pair) => pair.first.id === m.id || pair.second.id === m.id
        );
        return !isPaired;
      })
      .filter((m) => m.id !== currentUserId);
  }, [groupQ.data, currentUserId, event.data]);

  const isDisabled =
    !groupQ.data ||
    !availablePartners.length ||
    !userInfoQ.data ||
    isUserEnrolled;

  const enrollMutation = useActionMutation({
    action: enrollToEventTournament,
    onSuccess: () => {
      querryClient.invalidateQueries({
        queryKey: ["event"],
      });
      reset();
    },
  });

  function handleWithToast(data: FormSchemaType) {
    const promise = enrollMutation.mutateAsync({
      eventId: event.id,
      groupId: event.group.id,
      pair: {
        first: currentUserId || "",
        second: data.partnerId,
      },
    });

    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof enrollToEventTournament>) => {
        const errKey = getMessageKeyFromError(err, {
          generalErrorKey:
            "pages.EventPage.EventPairsTournamentEnrollment.toast.errorDefault",
        });
        return { title: tValidation(errKey) };
      },
    });
  }

  return (
    <Box bg="bg" borderRadius="md" boxShadow="sm" p={4} w="100%">
      <form onSubmit={handleFormSubmit(handleWithToast)}>
        <VStack align="start" spacing={4}>
          <ResponsiveHeading
            text={t("heading")}
            fontSize="sm"
            barOrientation="horizontal"
          />

          {isUserEnrolled && (
            <Box
              bg="green.50"
              color="green.700"
              p={3}
              borderRadius="md"
              w="100%"
              fontSize="sm"
            >
              {t("alreadyEnrolled")}
            </Box>
          )}

          <Controller
            control={formControl}
            name="partnerId"
            render={({ field, fieldState: { error } }) => (
              <SelectInput
                placeholder={t("selectPartner.placeholder")}
                isInvalid={!!error}
                errorMessage={tValidation(error?.message)}
                options={availablePartners.map((m) => ({
                  value: m.id,
                  label: getPersonLabel(m),
                }))}
                onSelectProps={{
                  ...field,
                }}
                isDisabled={isDisabled}
                isLoading={groupQ.isLoading || userInfoQ.isLoading}
              />
            )}
          />

          <Button
            leftIcon={<Icon as={FaUserPlus} />}
            colorScheme="accent"
            variant="solid"
            w="100%"
            type="submit"
            fontSize={{ base: "sm", md: "md" }}
            isDisabled={isDisabled}
          >
            {t("button")}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
