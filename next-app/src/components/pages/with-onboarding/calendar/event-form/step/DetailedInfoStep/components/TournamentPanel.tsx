"use client";

import SelectInput from "@/components/common/form/SelectInput";
import { Controller, useFormContext } from "react-hook-form";
import { TournamentType } from "@/club-preset/event-type";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import { getPersonLabel } from "@/components/pages/with-onboarding/calendar/event-form/util/helpers";
import { useGroupQuery } from "@/lib/queries";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

export default function TournamentPanel() {
  const form = useFormContext<AddEventSchemaType>();
  const tValidation = useTranslationsWithFallback();

  const selectedGroup = form.watch("group");
  const peopleQ = useGroupQuery(selectedGroup);

  const people = peopleQ.data?.members ?? [];

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
            isLoading={peopleQ.isLoading}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={form.control}
        name="data.arbiter"
        render={({ field, fieldState: { error } }) => (
          <SelectInput
            placeholder={"Sędzia główny"}
            isInvalid={!!error}
            errorMessage={tValidation(error?.message)}
            options={people.map((member) => ({
              value: member.id,
              label: getPersonLabel(member),
            }))}
            value={field.value}
            isLoading={peopleQ.isLoading}
            onChange={field.onChange}
          />
        )}
      />
    </>
  );
}
