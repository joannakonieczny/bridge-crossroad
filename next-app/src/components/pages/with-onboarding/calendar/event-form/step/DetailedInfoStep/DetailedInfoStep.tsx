"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Stack } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import FormInput from "@/components/common/form/FormInput";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import TournamentPanel from "./components/TournamentPanel";
import LeagueMeetingPanel from "./components/LeagueMeetingPanel";
import TrainingPanel from "./components/TrainingPanel";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

export function DetailedInfoStep() {
  const form = useFormContext<AddEventSchemaType>();
  const tValidation = useTranslationsWithFallback();

  const dataType = form.getValues().data.type;

  return (
    <Stack spacing={4}>
      {dataType === EventType.TOURNAMENT_PAIRS ||
      dataType === EventType.TOURNAMENT_TEAMS ? (
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
    </Stack>
  );
}
