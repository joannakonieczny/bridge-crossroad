"use client";

import SelectInput from "@/components/common/form/SelectInput";
import FormInput from "@/components/common/form/FormInput";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import { getPersonLabel } from "@/components/pages/with-onboarding/calendar/event-form/util/helpers";

type TournamentPanelProps = {
  people: {
    id: string;
    nickname?: string;
    name: { firstName: string; lastName: string };
  }[];
  isPeopleLoading: boolean;
};

export default function TrainingPanel({
  people,
  isPeopleLoading,
}: TournamentPanelProps) {
  const form = useFormContext<AddEventSchemaType>();
  const tValidation = useTranslationsWithFallback();

  return (
    <>
      <Controller
        control={form.control}
        name="data.coach"
        render={({ field, fieldState: { error } }) => (
          <SelectInput
            placeholder={"Trener"}
            isInvalid={!!error}
            errorMessage={tValidation(error?.message)}
            options={people.map((member) => ({
              value: member.id,
              label: getPersonLabel(member),
            }))}
            value={field.value}
            isLoading={isPeopleLoading}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={form.control}
        name="data.topic"
        render={({ field, fieldState: { error } }) => (
          <FormInput
            placeholder="Temat treningu"
            isInvalid={!!error}
            errorMessage={tValidation(error?.message)}
            type="text"
            id={field.name}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </>
  );
}
