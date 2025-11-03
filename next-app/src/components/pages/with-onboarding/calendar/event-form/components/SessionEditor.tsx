"use client";

import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import {
  VStack,
  HStack,
  Button,
  Box,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import SelectInput from "@/components/common/form/SelectInput";
import { getPersonLabel } from "../util/helpers";
import FormInput from "@/components/common/form/FormInput";

type SessionEditorProps = {
  people: {
    id: string;
    nickname?: string;
    name: { firstName: string; lastName: string };
  }[];
  isPeopleLoading: boolean;
};

export function SessionEditor(props: SessionEditorProps) {
  const form = useFormContext<AddEventSchemaType>();
  const tValidation = useTranslationsWithFallback();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "data.session",
  });

  const appendDefault = () =>
    append({
      contestants: {
        firstPair: { first: "", second: "" },
        secondPair: { first: "", second: "" },
      },
      opponentTeamName: "",
    });

  // TODO: add better validator to handle people here as set
  function RenderSelectInput(p: {
    name:
      | `data.session.${number}.contestants.firstPair.first`
      | `data.session.${number}.contestants.firstPair.second`
      | `data.session.${number}.contestants.secondPair.first`
      | `data.session.${number}.contestants.secondPair.second`;
    placeholder: string;
  }) {
    return (
      <Controller
        control={form.control}
        name={p.name}
        render={({ field, fieldState: { error } }) => (
          <SelectInput
            placeholder={p.placeholder}
            isInvalid={!!error}
            errorMessage={tValidation(error?.message)}
            options={props.people.map((member) => ({
              value: member.id,
              label: getPersonLabel(member),
            }))}
            value={field.value}
            isLoading={props.isPeopleLoading}
            onChange={field.onChange}
          />
        )}
      />
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {fields.map((field, idx) => (
        <Box key={field.id} borderWidth="1px" p={3} borderRadius="md">
          <VStack spacing={3} align="stretch">
            <HStack spacing={3}>
              <Text fontWeight="semibold">Numer meczu: {idx + 1}</Text>
              <IconButton
                aria-label="Delete session"
                colorScheme="red"
                icon={<MdDelete />}
                onClick={() => remove(idx)}
              />
            </HStack>

            <Text fontSize="sm">Pierwsza para</Text>
            <HStack spacing={2}>
              <RenderSelectInput
                name={`data.session.${idx}.contestants.firstPair.first`}
                placeholder="Zawodnik A"
              />
              <RenderSelectInput
                name={`data.session.${idx}.contestants.firstPair.second`}
                placeholder="Zawodnik B"
              />
            </HStack>
            <Text fontSize="sm">Druga para</Text>
            <HStack spacing={2}>
              <RenderSelectInput
                name={`data.session.${idx}.contestants.secondPair.first`}
                placeholder="Zawodnik C"
              />
              <RenderSelectInput
                name={`data.session.${idx}.contestants.secondPair.second`}
                placeholder="Zawodnik D"
              />
            </HStack>
            <Controller
              control={form.control}
              name={`data.session.${idx}.opponentTeamName`}
              render={({ field, fieldState: { error } }) => (
                <FormInput
                  placeholder={"Nazwa zespołu przeciwnika (opcjonalne)"}
                  errorMessage={tValidation(error?.message)}
                  isInvalid={!!error}
                  id={field.name}
                  type={"text"}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </VStack>
        </Box>
      ))}

      <HStack>
        <Button leftIcon={<MdAdd />} onClick={appendDefault} size="sm">
          Dodaj sesję
        </Button>
      </HStack>
    </VStack>
  );
}
