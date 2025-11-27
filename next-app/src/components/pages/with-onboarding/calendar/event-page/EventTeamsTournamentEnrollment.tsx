"use client";

import { Box, VStack, Button, Icon, useToast } from "@chakra-ui/react";
import { FaUserPlus } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import type {
  EventSchemaTypePopulated,
  PlayingTeamType,
  TournamentTeamsDataTypePopulated,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { withEmptyToUndefined } from "@/schemas/common";
import MultiSelectInput from "@/components/common/form/MultiSelectInput";
import FormInput from "@/components/common/form/FormInput";
import { useMemo } from "react";
import { EventType } from "@/club-preset/event-type";
import { playingTeamSchema } from "@/schemas/model/event/event-schema";

type EventTeamsTournamentEnrollmentProps = {
  event: EventSchemaTypePopulated;
};

export default function EventTeamsTournamentEnrollment({
  event,
}: EventTeamsTournamentEnrollmentProps) {
  const t = useTranslations("pages.EventPage.EventTeamsTournamentEnrollment");
  const tValidation = useTranslationsWithFallback();

  const {
    handleSubmit: handleFormSubmit,
    control: formControl,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(withEmptyToUndefined(playingTeamSchema)),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const querryClient = useQueryClient();
  const toast = useToast();

  const userInfoQ = useUserInfoQuery();
  const groupQ = useGroupQuery(event.group.id);

  const currentUserId = userInfoQ.data?.id;
  const selectedMemberIds = watch("members") || [];

  const isUserEnrolled = useMemo(() => {
    if (!currentUserId || event.data.type !== EventType.TOURNAMENT_TEAMS)
      return false;

    const teams = (event.data as TournamentTeamsDataTypePopulated).teams ?? [];

    return teams.some((team) =>
      team.members.some((member) => member.id === currentUserId)
    );
  }, [currentUserId, event.data]);

  const availableMembers = useMemo(() => {
    if (!groupQ.data || !currentUserId) return [];
    if (event.data.type !== EventType.TOURNAMENT_TEAMS) return [];

    const members = groupQ.data.members;
    const teams = (event.data as TournamentTeamsDataTypePopulated).teams ?? [];

    const enrolledMemberIds = new Set(
      teams.flatMap((team) => team.members.map((m) => m.id))
    );

    return members.filter((m) => !enrolledMemberIds.has(m.id));
  }, [groupQ.data, currentUserId, event.data]);

  const isCurrentUserSelected = selectedMemberIds.includes(currentUserId || "");
  const isDisabled =
    !groupQ.data || !userInfoQ.data || isUserEnrolled || !isCurrentUserSelected;

  const enrollMutation = useActionMutation({
    action: enrollToEventTournament,
    onSuccess: () => {
      querryClient.invalidateQueries({
        queryKey: ["event"],
      });
      reset();
    },
  });

  function handleWithToast(data: PlayingTeamType) {
    const promise = enrollMutation.mutateAsync({
      eventId: event.id,
      groupId: event.group.id,
      team: {
        name: data.name,
        members: data.members,
      },
    });

    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof enrollToEventTournament>) => {
        const errKey = getMessageKeyFromError(err, {
          generalErrorKey:
            "pages.EventPage.EventTeamsTournamentEnrollment.toast.errorDefault",
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

          {!isCurrentUserSelected && (
            <Box
              bg="orange.50"
              color="orange.700"
              p={3}
              borderRadius="md"
              w="100%"
              fontSize="sm"
            >
              Musisz być członkiem swojej drużyny
            </Box>
          )}

          <Controller
            control={formControl}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("teamName.placeholder")}
                isInvalid={!!error}
                errorMessage={tValidation(error?.message)}
                id="teamName"
                type="text"
                value={field.value}
                onChange={field.onChange}
                onElementProps={{
                  isDisabled: isUserEnrolled,
                }}
              />
            )}
          />

          <Controller
            control={formControl}
            name="members"
            render={({ field, fieldState: { error } }) => (
              <MultiSelectInput
                placeholder={t("selectMembers.placeholder")}
                isInvalid={!!error}
                errorMessage={tValidation(error?.message)}
                options={availableMembers.map((m) => ({
                  value: m.id,
                  label: getPersonLabel(m),
                }))}
                value={field.value}
                onChange={field.onChange}
                isDisabled={isUserEnrolled}
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
