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
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import {
  useTranslationsWithFallback,
  useTranslations,
} from "@/lib/typed-translations";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import SelectInput from "@/components/common/form/SelectInput";
import { getPersonLabel } from "@/util/formatters";
import FormInput from "@/components/common/form/FormInput";
import { useGroupQuery } from "@/lib/queries";

export function SessionEditor() {
  const form = useFormContext<AddEventSchemaType>();

  const t = useTranslations(
    "pages.EventFormPage.detailedInfoStep.sessionEditor"
  );
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

  const selectedGroup = form.watch("group");
  const peopleQ = useGroupQuery(selectedGroup);

  const people = peopleQ.data?.members ?? [];

  function RenderSelectInput(p: {
    name:
      | `data.session.${number}.contestants.firstPair.first`
      | `data.session.${number}.contestants.firstPair.second`
      | `data.session.${number}.contestants.secondPair.first`
      | `data.session.${number}.contestants.secondPair.second`;
    placeholder: string;
    isInvalid?: boolean;
    sessionIndex: number;
  }) {
    return (
      <Controller
        control={form.control}
        name={p.name}
        render={({ field, fieldState: { error } }) => {
          // Compute excluded ids from current session (other selected players)
          const sessionData = form.getValues(
            `data.session.${p.sessionIndex}`
          ) as
            | {
                contestants?: {
                  firstPair?: { first?: string; second?: string };
                  secondPair?: { first?: string; second?: string };
                };
              }
            | undefined;

          const allIds = [
            sessionData?.contestants?.firstPair?.first,
            sessionData?.contestants?.firstPair?.second,
            sessionData?.contestants?.secondPair?.first,
            sessionData?.contestants?.secondPair?.second,
          ].filter((id): id is string => !!id);

          // Exclude other selected ids but keep current field value available
          const excludeIds = allIds.filter((id) => id !== field.value);

          const availableOptions = people
            .filter(
              (member) =>
                !excludeIds.includes(member.id) || member.id === field.value
            )
            .map((member) => ({
              value: member.id,
              label: getPersonLabel(member),
            }));

          return (
            <SelectInput
              emptyValueLabel={p.placeholder}
              isInvalid={p.isInvalid || !!error}
              errorMessage={tValidation(error?.message)}
              options={availableOptions}
              value={field.value}
              isLoading={peopleQ.isLoading}
              onChange={field.onChange}
            />
          );
        }}
      />
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {fields.map((field, idx) => {
        const dataErrors = form.formState?.errors?.data as
          | {
              session?: Array<{
                contestants?: { message?: string };
              }>;
            }
          | undefined;
        const sessionError = dataErrors?.session?.[idx]?.contestants?.message;

        // Get current values for this session to identify duplicates
        const sessionData = form.watch(`data.session.${idx}`);
        const selectedPlayers = [
          sessionData?.contestants?.firstPair?.first,
          sessionData?.contestants?.firstPair?.second,
          sessionData?.contestants?.secondPair?.first,
          sessionData?.contestants?.secondPair?.second,
        ].filter((id) => !!id);

        // Find duplicates
        const duplicates = new Set<string>();
        const seen = new Set<string>();
        selectedPlayers.forEach((playerId) => {
          if (seen.has(playerId)) {
            duplicates.add(playerId);
          }
          seen.add(playerId);
        });

        // Check if specific field has duplicate value
        const isDuplicate = (playerId: string | undefined): boolean => {
          return !!(playerId && duplicates.has(playerId));
        };

        return (
          <Box
            key={field.id}
            borderWidth="1px"
            p={3}
            borderRadius="md"
            borderColor={sessionError ? "red.500" : undefined}
          >
            <VStack spacing={3} align="stretch">
              <HStack spacing={3}>
                <Text fontWeight="semibold">
                  {`${t("matchNumberPlaceholder")} ${idx + 1}`}
                </Text>
                <Spacer />
                <IconButton
                  aria-label="Delete session"
                  colorScheme="red"
                  icon={<MdDelete />}
                  onClick={() => remove(idx)}
                  disabled={!(fields.length - 1 === idx)} //only can delete last item, TODO add some label on hover?
                  alignSelf="end"
                  justifySelf="end"
                />
              </HStack>
              {sessionError && (
                <Text color="red.500" fontSize="sm">
                  {tValidation(sessionError)}
                </Text>
              )}

              <Text fontSize="sm">{t("firstPairLabel")}</Text>
              <HStack spacing={2}>
                <RenderSelectInput
                  name={`data.session.${idx}.contestants.firstPair.first`}
                  placeholder={t("firstPlayerPlaceholder")}
                  isInvalid={isDuplicate(
                    sessionData?.contestants?.firstPair?.first
                  )}
                  sessionIndex={idx}
                />
                <RenderSelectInput
                  name={`data.session.${idx}.contestants.firstPair.second`}
                  placeholder={t("secondPlayerPlaceholder")}
                  isInvalid={isDuplicate(
                    sessionData?.contestants?.firstPair?.second
                  )}
                  sessionIndex={idx}
                />
              </HStack>
              <Text fontSize="sm">{t("secondPairLabel")}</Text>
              <HStack spacing={2}>
                <RenderSelectInput
                  name={`data.session.${idx}.contestants.secondPair.first`}
                  placeholder={t("firstPlayerPlaceholder")}
                  isInvalid={isDuplicate(
                    sessionData?.contestants?.secondPair?.first
                  )}
                  sessionIndex={idx}
                />
                <RenderSelectInput
                  name={`data.session.${idx}.contestants.secondPair.second`}
                  placeholder={t("secondPlayerPlaceholder")}
                  isInvalid={isDuplicate(
                    sessionData?.contestants?.secondPair?.second
                  )}
                  sessionIndex={idx}
                />
              </HStack>
              <Controller
                control={form.control}
                name={`data.session.${idx}.opponentTeamName`}
                render={({ field, fieldState: { error } }) => (
                  <FormInput
                    placeholder={t("opponentTeamNamePlaceholder")}
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
        );
      })}

      <Stack>
        <Button
          leftIcon={<MdAdd />}
          onClick={appendDefault}
          size="sm"
          isLoading={peopleQ.isLoading}
          disabled={peopleQ.isLoading || people.length < 4}
        >
          {t("addSessionButton")}
        </Button>
        {!peopleQ.isLoading && people.length < 4 && (
          <Text color="neutral.500" fontSize="sm">
            {t("tooFewPeopleInGroupWarning")}
          </Text>
        )}
      </Stack>
    </VStack>
  );
}
