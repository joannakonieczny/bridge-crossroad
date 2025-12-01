"use client";

import { useFormContext } from "react-hook-form";
import { Stack, Text, Divider, Center, Spacer } from "@chakra-ui/react";
import { SteeringButtons } from "../components/SteeringButtons";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import { EventType } from "@/club-preset/event-type";
import { useTranslations } from "@/lib/typed-translations";
import { useGroupQuery } from "@/lib/queries";
import { getPersonLabel } from "@/util/formatters";
import dayjs from "dayjs";
import type { PropsWithChildren } from "react";

export type StepProps = {
  setNextStep?: () => void;
  setPrevStep?: () => void;
  isUploading?: boolean;
} & PropsWithChildren;

export function SummaryStep({ setPrevStep, isUploading, children }: StepProps) {
  const t = useTranslations("pages.EventFormPage");
  const tEvent = useTranslations("common.eventType");
  const tTournament = useTranslations("common.tournamentType");

  const form = useFormContext<AddEventSchemaType>();
  const values = form.getValues();
  const data = values?.data;

  const groupQ = useGroupQuery(values.group);
  const organizerMember = groupQ.data?.members.find(
    (m) => m.id === values.organizer
  );
  const organizerName = getPersonLabel(organizerMember);

  return (
    <Stack spacing={4} direction="column">
      <Divider />
      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.title")}</Text>
        <Text fontWeight="bold">{values.title}</Text>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.description")}</Text>
        <Text fontWeight="bold">{values.description}</Text>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.group")}</Text>
        <Text fontWeight="bold">{groupQ.data?.name ?? values.group}</Text>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.organizer")}</Text>
        <Text fontWeight="bold">{organizerName ?? "-"}</Text>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.eventStart")}</Text>
        <Text fontWeight="bold">
          {values.duration?.startsAt
            ? dayjs(values.duration.startsAt).format("DD.MM.YYYY HH:mm")
            : "-"}
        </Text>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.eventEnd")}</Text>
        <Text fontWeight="bold">
          {values.duration?.endsAt
            ? dayjs(values.duration.endsAt).format("DD.MM.YYYY HH:mm")
            : "-"}
        </Text>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.eventType")}</Text>
        <Text fontWeight="bold">{tEvent(values.data?.type)}</Text>
      </Stack>
      {(data?.type === EventType.TOURNAMENT_PAIRS ||
        data?.type === EventType.TOURNAMENT_TEAMS) && (
        <>
          <Divider />
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.tournament.type")}</Text>
            <Text fontWeight="bold">
              {data.tournamentType ? tTournament(data.tournamentType) : "-"}
            </Text>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.tournament.arbiter")}</Text>
            <Text fontWeight="bold">
              {getPersonLabel(
                groupQ.data?.members.find((m) => m.id === data.arbiter)
              ) ?? "-"}
            </Text>
          </Stack>
        </>
      )}

      {data?.type === EventType.LEAGUE_MEETING && (
        <>
          <Divider />
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.tournament.type")}</Text>
            <Text fontWeight="bold">
              {data.tournamentType ? tTournament(data.tournamentType) : "-"}
            </Text>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.leagueMeeting.totalRounds")}</Text>
            <Text fontWeight="bold">
              {Array.isArray(data.session) ? data.session.length : 0}
            </Text>
          </Stack>
          {data.session &&
            data.session.length > 0 &&
            data.session.map((session, index) => {
              return (
                <Stack key={index} width="100%" spacing={4}>
                  <Divider />
                  <Stack direction="column" spacing={3}>
                    <Center>
                      <Text fontWeight="bold">{`${t(
                        "summaryStep.leagueMeeting.sessionName"
                      )} ${index + 1}`}</Text>
                    </Center>
                    <Divider variant="dashed" />
                    <Center>
                      <Text fontWeight="bold">
                        {t("detailedInfoStep.sessionEditor.firstPairLabel")}
                      </Text>
                    </Center>
                    <Stack direction="row" spacing={3} width="100%">
                      <Stack
                        direction="column"
                        spacing={3}
                        alignItems="center"
                        width="33%"
                      >
                        <Text>
                          {t("summaryStep.leagueMeeting.firstPlayer")}
                        </Text>
                        <Text
                          fontWeight="bold"
                          textAlign="center"
                          overflowWrap="anywhere"
                          wordBreak="break-word"
                        >
                          {getPersonLabel(
                            groupQ.data?.members.find(
                              (m) =>
                                m.id === session.contestants?.firstPair?.first
                            )
                          ) ?? "-"}
                        </Text>
                      </Stack>
                      <Spacer />
                      <Stack
                        direction="column"
                        spacing={3}
                        alignItems="center"
                        width="33%"
                      >
                        <Text>
                          {t("summaryStep.leagueMeeting.secondPlayer")}
                        </Text>
                        <Text
                          fontWeight="bold"
                          textAlign="center"
                          overflowWrap="anywhere"
                          wordBreak="break-word"
                        >
                          {getPersonLabel(
                            groupQ.data?.members.find(
                              (m) =>
                                m.id === session.contestants?.firstPair?.second
                            )
                          ) ?? "-"}
                        </Text>
                      </Stack>
                    </Stack>
                    <Divider variant="dashed" />
                    <Center>
                      <Text fontWeight="bold">
                        {t("detailedInfoStep.sessionEditor.secondPairLabel")}
                      </Text>
                    </Center>
                    <Stack direction="row" spacing={3} width="100%">
                      <Stack
                        direction="column"
                        spacing={3}
                        alignItems="center"
                        width="33%"
                      >
                        <Text>
                          {t("summaryStep.leagueMeeting.firstPlayer")}
                        </Text>
                        <Text
                          fontWeight="bold"
                          textAlign="center"
                          overflowWrap="anywhere"
                          wordBreak="break-word"
                        >
                          {getPersonLabel(
                            groupQ.data?.members.find(
                              (m) =>
                                m.id === session.contestants?.secondPair?.first
                            )
                          ) ?? "-"}
                        </Text>
                      </Stack>
                      <Spacer />
                      <Stack
                        direction="column"
                        spacing={3}
                        alignItems="center"
                        width="33%"
                      >
                        <Text>
                          {t("summaryStep.leagueMeeting.secondPlayer")}
                        </Text>
                        <Text
                          fontWeight="bold"
                          textAlign="center"
                          overflowWrap="anywhere"
                          wordBreak="break-word"
                        >
                          {getPersonLabel(
                            groupQ.data?.members.find(
                              (m) =>
                                m.id === session.contestants?.secondPair?.second
                            )
                          ) ?? "-"}
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>

                  {session.opponentTeamName && (
                    <>
                      <Divider variant="dashed" />
                      <Center>
                        <Stack direction="row" spacing={3}>
                          <Text>
                            {t("summaryStep.leagueMeeting.opponentTeamName")}
                          </Text>
                          <Text
                            fontWeight="bold"
                            overflowWrap="anywhere"
                            wordBreak="break-word"
                          >
                            {session.opponentTeamName}
                          </Text>
                        </Stack>
                      </Center>
                    </>
                  )}
                </Stack>
              );
            })}
        </>
      )}

      {data?.type === EventType.TRAINING && (
        <>
          <Divider />
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.training.coach")}</Text>
            <Text fontWeight="bold">
              {getPersonLabel(
                groupQ.data?.members.find((m) => m.id === data.coach)
              ) ?? "-"}
            </Text>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={3}>
            <Text>{t("summaryStep.training.topic")}</Text>
            <Text fontWeight="bold">{data.topic ?? "-"}</Text>
          </Stack>
        </>
      )}
      <Divider />
      <Stack direction="row" spacing={3}>
        <Text>{t("summaryStep.additionalDescription")}</Text>
        <Text fontWeight="bold">{values.additionalDescription ?? "-"}</Text>
      </Stack>
      <Divider />
      {children}
      <SteeringButtons
        prevButton={{
          text: t("buttons.prev"),
          onClick: setPrevStep,
        }}
        nextButton={{
          text: t("buttons.submit"),
          onElementProps: {
            type: "submit",
            isLoading: isUploading,
          },
        }}
      />
    </Stack>
  );
}
