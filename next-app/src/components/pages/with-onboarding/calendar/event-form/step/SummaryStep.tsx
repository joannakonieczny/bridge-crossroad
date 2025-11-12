"use client";

import { useFormContext } from "react-hook-form";
import { Stack, Text } from "@chakra-ui/react";
import { SteeringButtons } from "../components/SteeringButtons";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import type { StepProps } from "../util/helpers";
import { EventType } from "@/club-preset/event-type";
import { useTranslations } from "@/lib/typed-translations";

function formatDate(d?: Date | string) {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString();
}

export function SummaryStep({ setPrevStep }: StepProps) {
  const t = useTranslations("pages.EventFormPage.summaryStep");
  const tEvent = useTranslations("common.eventType");
  const tTournament = useTranslations("common.tournamentType");

  const form = useFormContext<AddEventSchemaType>();
  const values = form.getValues();
  const data = values?.data;

  return (
    <Stack spacing={4} direction="column">
      <Stack direction="row" spacing={3}>
        <Text>{t("title")}</Text>
        <Text fontWeight="bold">{values.title}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("description")}</Text>
        <Text fontWeight="bold">{values.description}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("group")}</Text>
        <Text fontWeight="bold">{values.group}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("organizer")}</Text>
        <Text fontWeight="bold">{values.organizer}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("eventStart")}</Text>
        <Text fontWeight="bold">{formatDate(values.duration?.startsAt)}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("eventEnd")}</Text>
        <Text fontWeight="bold">{formatDate(values.duration?.endsAt)}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("eventType")}</Text>
        <Text fontWeight="bold">{tEvent(values.data?.type)}</Text>
      </Stack>

      {data?.type === EventType.TOURNAMENT && (
        <>
          <Stack direction="row" spacing={3}>
            <Text>{t("tournament.type")}</Text>
            <Text fontWeight="bold">
              {data.tournamentType ? tTournament(data.tournamentType) : "-"}
            </Text>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Text>{t("tournament.arbiter")}</Text>
            <Text fontWeight="bold">{data.arbiter ?? "-"}</Text>
          </Stack>
        </>
      )}

      {data?.type === EventType.LEAGUE_MEETING && (
        <>
          <Stack direction="row" spacing={3}>
            <Text>{t("tournament.type")}</Text>
            <Text fontWeight="bold">
              {data.tournamentType ? tTournament(data.tournamentType) : "-"}
            </Text>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Text>{t("leagueMeeting.totalRounds")}</Text>
            <Text fontWeight="bold">
              {Array.isArray(data.session) ? data.session.length : 0}
            </Text>
          </Stack>
        </>
      )}

      {data?.type === EventType.TRAINING && (
        <>
          <Stack direction="row" spacing={3}>
            <Text>{t("training.coach")}</Text>
            <Text fontWeight="bold">{data.coach ?? "-"}</Text>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Text>{t("training.topic")}</Text>
            <Text fontWeight="bold">{data.topic ?? "-"}</Text>
          </Stack>
        </>
      )}

      <Stack direction="row" spacing={3}>
        <Text>{t("additionalDescription")}</Text>
        <Text fontWeight="bold">{values.additionalDescription ?? "-"}</Text>
      </Stack>

      <SteeringButtons
        prevButton={{
          text: t("buttons.revButton"),
          onClick: setPrevStep,
        }}
        nextButton={{
          text: t("buttons.submitButton"),
          onElementProps: {
            type: "submit",
          },
        }}
      />
    </Stack>
  );
}
