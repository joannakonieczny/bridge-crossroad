"use client";

import { useFormContext } from "react-hook-form";
import { Stack, Text } from "@chakra-ui/react";
import { SteeringButtons } from "../components/SteeringButtons";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import type { StepProps } from "../util/helpers";
import { useTranslations } from "@/lib/typed-translations";

export function SummaryStep({ setPrevStep }: StepProps) {
  const form = useFormContext<AddEventSchemaType>();

  const t = useTranslations("pages.EventFormPage.summaryStep");

  // TODO: add more summary details here

  return (
    <Stack spacing={4}>
      <Text>
        {" "}
        {t("title")} {form.getValues()?.title}
      </Text>
      <Text>
        {" "}
        {t("description")} {form.getValues()?.description}
      </Text>
      <SteeringButtons
        prevButton={{
          text: t("revButton"),
          onClick: setPrevStep,
        }}
        nextButton={{
          text: t("submitButton"),
          onElementProps: {
            type: "submit",
          },
        }}
      />
    </Stack>
  );
}
