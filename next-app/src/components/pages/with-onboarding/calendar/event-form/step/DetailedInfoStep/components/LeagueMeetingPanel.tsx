"use client";

import SelectInput from "@/components/common/form/SelectInput";
import { SessionEditor } from "@/components/pages/with-onboarding/calendar/event-form/components/SessionEditor";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import { TournamentType } from "@/club-preset/event-type";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

type LeagueMeetingPanelProps = {
  people: {
    id: string;
    nickname?: string;
    name: { firstName: string; lastName: string };
  }[];
  isPeopleLoading: boolean;
};

export default function LeagueMeetingPanel({
  people,
  isPeopleLoading,
}: LeagueMeetingPanelProps) {
  const form = useFormContext<AddEventSchemaType>();
  const tValidation = useTranslationsWithFallback();

  return (
    <>
      <Controller
        control={form.control}
        name="data.tournamentType"
        render={({ field, fieldState: { error } }) => (
          <SelectInput
            placeholder={"Typ Turnieju"}
            isInvalid={!!error}
            errorMessage={tValidation(error?.message)}
            options={Object.values(TournamentType).map((type) => ({
              value: type,
              label: type, // TODO - translation
            }))}
            value={field.value}
            isLoading={isPeopleLoading}
          />
        )}
      />
      <SessionEditor people={people} />
    </>
  );
}
