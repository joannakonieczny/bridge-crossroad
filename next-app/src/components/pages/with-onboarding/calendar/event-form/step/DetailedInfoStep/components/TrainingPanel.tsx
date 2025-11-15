"use client";

import SelectInput from "@/components/common/form/SelectInput";
import FormInput from "@/components/common/form/FormInput";
import { Controller, useFormContext } from "react-hook-form";
import {
  useTranslationsWithFallback,
  useTranslations,
} from "@/lib/typed-translations";
import { useGroupQuery } from "@/lib/queries";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import { getPersonLabel } from "@/components/pages/with-onboarding/calendar/event-form/util/helpers";

export default function TrainingPanel() {
  const form = useFormContext<AddEventSchemaType>();

  const t = useTranslations(
    "pages.EventFormPage.detailedInfoStep.trainingPanel"
  );
  const tValidation = useTranslationsWithFallback();

  const selectedGroup = form.watch("group");
  const peopleQ = useGroupQuery(selectedGroup);

  const people = peopleQ.data?.members ?? [];

  return (
    <>
      <Controller
        control={form.control}
        name="data.coach"
        render={({ field, fieldState: { error } }) => (
          <SelectInput
            placeholder={t("coachPlaceholder")}
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
      <Controller
        control={form.control}
        name="data.topic"
        render={({ field, fieldState: { error } }) => (
          <FormInput
            placeholder={t("topicPlaceholder")}
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
