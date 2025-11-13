"use client";

import { useFormContext } from "react-hook-form";
import { Stack, Text } from "@chakra-ui/react";
import { SteeringButtons } from "../components/SteeringButtons";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import type { StepProps } from "../util/helpers";
import { EventType } from "@/club-preset/event-type";
import { useTranslations } from "@/lib/typed-translations";
import dayjs from "dayjs";

export function SummaryStep({ setPrevStep }: StepProps) {
  const t = useTranslations("pages.EventFormPage");
  const tEvent = useTranslations("common.eventType");
  const tTournament = useTranslations("common.tournamentType");

  const form = useFormContext<AddEventSchemaType>();
  const values = form.getValues();
  const data = values?.data;

  return (
    <Stack spacing={4} direction="column">
      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.title")}</Text>
        <Text fontWeight="bold">{values.title}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.description")}</Text>
        <Text fontWeight="bold">{values.description}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.group")}</Text>
        <Text fontWeight="bold">{values.group}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.organizer")}</Text>
        <Text fontWeight="bold">{values.organizer}</Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.eventStart")}</Text>
        <Text fontWeight="bold">
          {values.duration?.startsAt
            ? dayjs(values.duration.startsAt).format("DD.MM.YYYY HH:mm")
            : "-"}
        </Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.eventEnd")}</Text>
        <Text fontWeight="bold">
          {values.duration?.endsAt
            ? dayjs(values.duration.endsAt).format("DD.MM.YYYY HH:mm")
            : "-"}
        </Text>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.eventType")}</Text>
        <Text fontWeight="bold">{tEvent(values.data?.type)}</Text>
      </Stack>

      {data?.type === EventType.TOURNAMENT && (
        <>
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.tournament.type")}</Text>
            <Text fontWeight="bold">
              {data.tournamentType ? tTournament(data.tournamentType) : "-"}
            </Text>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.tournament.arbiter")}</Text>
            <Text fontWeight="bold">{data.arbiter ?? "-"}</Text>
          </Stack>
        </>
      )}

      {data?.type === EventType.LEAGUE_MEETING && (
        <>
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.tournament.type")}</Text>
            <Text fontWeight="bold">
              {data.tournamentType ? tTournament(data.tournamentType) : "-"}
            </Text>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.leagueMeeting.totalRounds")}</Text>
            <Text fontWeight="bold">
              {Array.isArray(data.session) ? data.session.length : 0}
            </Text>
          </Stack>
        </>
      )}

      {data?.type === EventType.TRAINING && (
        <>
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.training.coach")}</Text>
            <Text fontWeight="bold">{data.coach ?? "-"}</Text>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.training.topic")}</Text>
            <Text fontWeight="bold">{data.topic ?? "-"}</Text>
          </Stack>
        </>
      )}

      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.additionalDescription")}</Text>
        <Text fontWeight="bold">{values.additionalDescription ?? "-"}</Text>
      </Stack>

      <SteeringButtons
        prevButton={{
          text: t("buttons.prev"),
          onClick: setPrevStep,
        }}
        nextButton={{
          text: t("buttons.next"),
          onElementProps: {
            type: "submit",
          },
        }}
      />
    </Stack>
  );
}
