"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormControl, Select } from "@chakra-ui/react";
import FormInput from "@/components/common/form/FormInput";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

type Member = {
  id: string;
  nickname?: string;
  name: { firstName: string; lastName: string };
};

export default function TrainingPanel({ people }: { people: Member[] }) {
  const form = useFormContext<AddEventSchemaType>();

  return (
    <>
      <Controller
        control={form.control}
        name="data.coach"
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            <Select
              placeholder="Trener"
              id="coach"
              value={field.value as unknown as string}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {people.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.nickname
                    ? member.nickname
                    : `${member.name.firstName} ${member.name.lastName}`}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        control={form.control}
        name="data.topic"
        render={({ field, fieldState: { error } }) => (
          <FormInput
            placeholder="Temat treningu"
            errorMessage={error?.message as unknown as string}
            isInvalid={!!error}
            id="topic"
            type="text"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </>
  );
}
