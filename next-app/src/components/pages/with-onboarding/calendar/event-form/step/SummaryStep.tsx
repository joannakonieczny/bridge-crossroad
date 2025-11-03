"use client";

import { useFormContext } from "react-hook-form";
import { Stack, Button, Text } from "@chakra-ui/react";
import { MdArrowBackIos } from "react-icons/md";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

type Props = {
  setPrevStep: () => void;
};

export function SummaryStep({ setPrevStep }: Props) {
  const form = useFormContext<AddEventSchemaType>();

  return (
    <Stack spacing={4}>
      <Text>Tytuł wydarzenia: {form.getValues()?.title}</Text>
      <Text></Text>
      <Button
        variant="outline"
        alignSelf="flex-start"
        onClick={() => {
          setPrevStep();
        }}
        leftIcon={<MdArrowBackIos />}
      >
        Cofnij
      </Button>
    </Stack>
  );
}
