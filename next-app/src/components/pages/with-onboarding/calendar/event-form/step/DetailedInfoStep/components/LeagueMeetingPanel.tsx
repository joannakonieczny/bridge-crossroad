"use client";

import SelectInput from "@/components/common/form/SelectInput";
import { SessionEditor } from "@/components/pages/with-onboarding/calendar/event-form/components/SessionEditor";
import { useFormContext, Controller } from "react-hook-form";
import {
  useTranslationsWithFallback,
  useTranslations,
} from "@/lib/typed-translations";
import { TournamentType } from "@/club-preset/event-type";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

export default function LeagueMeetingPanel() {
  const form = useFormContext<AddEventSchemaType>();

  const t = useTranslations("pages.EventFormPage.tournamentPanel");
  const tTournaments = useTranslations("common.tournamentType");
  const tValidation = useTranslationsWithFallback();

  return (
    <>
      <Controller
        control={form.control}
        name="data.tournamentType"
        render={({ field, fieldState: { error } }) => (
          <SelectInput
            placeholder={t("tournamentTypePlaceholder")}
            isInvalid={!!error}
            errorMessage={tValidation(error?.message)}
            options={Object.values(TournamentType).map((type) => ({
              value: type,
              label: tTournaments(`${type}`),
            }))}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <SessionEditor />
    </>
  );
}
