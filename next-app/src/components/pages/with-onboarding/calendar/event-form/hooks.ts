"use client";

import type { FieldPath, UseFormReturn } from "react-hook-form";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import { EventType } from "@/club-preset/event-type";

export function useValidatePrimaryInfoStep(
  form: UseFormReturn<AddEventSchemaType>
) {
  const validateStep = async () => {
    return await form.trigger([
      "title",
      "description",
      "group",
      "organizer",
      "data.type",
      "duration.startsAt",
      "duration.endsAt",
    ]);
  };

  return validateStep;
}

export function useValidateDetailedInfoStep(
  form: UseFormReturn<AddEventSchemaType>
) {
  const validateStep = async () => {
    const dataType = form.getValues().data.type;
    let ok = false;

    const commonFields = [
      "additionalDescription",
    ] satisfies FieldPath<AddEventSchemaType>[];

    switch (dataType) {
      case EventType.TOURNAMENT_PAIRS: {
        ok = await form.trigger([
          ...commonFields,
          "data.tournamentType",
          "data.arbiter",
        ]);
        break;
      }
      case EventType.TOURNAMENT_TEAMS: {
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

    return ok;
  };

  return validateStep;
}
