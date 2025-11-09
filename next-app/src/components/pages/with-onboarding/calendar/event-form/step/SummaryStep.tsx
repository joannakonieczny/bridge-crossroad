"use client";

import { useFormContext } from "react-hook-form";
import { Stack, Text } from "@chakra-ui/react";
import { SteeringButtons } from "../components/SteeringButtons";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import type { StepProps } from "../util/helpers";

export function SummaryStep({ setPrevStep }: StepProps) {
  const form = useFormContext<AddEventSchemaType>();

  // TODO: add more summary details here

  return (
    <Stack spacing={4}>
      <Text>Tytuł wydarzenia: {form.getValues()?.title}</Text>
      <Text></Text>
      <SteeringButtons
        prevButton={{
          text: "Cofnij", //TODO - translation
          onClick: setPrevStep,
        }}
        nextButton={{
          text: "Dodaj wydarzenie",
          onElementProps: {
            type: "submit",
          },
        }}
      />
    </Stack>
  );
}
