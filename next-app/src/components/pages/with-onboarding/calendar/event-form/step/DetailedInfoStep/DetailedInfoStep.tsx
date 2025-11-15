"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Stack } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import FormInput from "@/components/common/form/FormInput";
import {
  useTranslationsWithFallback,
  useTranslations,
} from "@/lib/typed-translations";
import TournamentPanel from "./components/TournamentPanel";
import LeagueMeetingPanel from "./components/LeagueMeetingPanel";
import TrainingPanel from "./components/TrainingPanel";
import { SteeringButtons } from "../../components/SteeringButtons";
import type { FieldPath } from "react-hook-form";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

export type StepProps = {
  setNextStep?: () => void;
  setPrevStep?: () => void;
};

export function DetailedInfoStep({ setNextStep, setPrevStep }: StepProps) {
  const form = useFormContext<AddEventSchemaType>();
  const tValidation = useTranslationsWithFallback();
  const t = useTranslations("pages.EventFormPage");

  const dataType = form.getValues().data.type;

  const handleNextStep = async () => {
    let ok = false;
    const commonFields = [
      "additionalDescription",
    ] satisfies FieldPath<AddEventSchemaType>[];
    switch (dataType) {
      case EventType.TOURNAMENT: {
        ok = await form.trigger([
          ...commonFields,
          "data.tournamentType",
          "data.arbiter",
        ]);
        break;
      }
      case EventType.LEAGUE_MEETING: {
        ok = await form.trigger([
          ...commonFields,
          "data.session",
          "data.tournamentType",
        ]);
        break;
      }
      case EventType.TRAINING: {
        ok = await form.trigger([...commonFields, "data.coach", "data.topic"]);
        break;
      }
      case EventType.OTHER: {
        ok = await form.trigger(commonFields);
        break;
      }
    }
    if (ok) setNextStep?.();
  };

  return (
    <Stack spacing={4}>
      {dataType === EventType.TOURNAMENT ? (
        <TournamentPanel />
      ) : dataType === EventType.LEAGUE_MEETING ? (
        <LeagueMeetingPanel />
      ) : dataType === EventType.TRAINING ? (
        <TrainingPanel />
      ) : (
        <></>
      )}
      <Controller
        control={form.control}
        name="additionalDescription"
        render={({ field, fieldState: { error } }) => (
          <FormInput
            placeholder="Dodatkowy opis wydarzenia"
            errorMessage={tValidation(error?.message)}
            isInvalid={!!error}
            type="textarea"
            id={field.name}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <SteeringButtons
        prevButton={{
          onClick: setPrevStep,
          text: t("buttons.prev"),
        }}
        nextButton={{
          onClick: handleNextStep,
          text: t("buttons.next"),
        }}
      />
    </Stack>
  );
}
