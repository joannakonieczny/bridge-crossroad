"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Stack, HStack, Button } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import FormInput from "@/components/common/form/FormInput";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { QUERY_KEYS } from "@/lib/query-keys";
import { getGroupData } from "@/services/groups/api";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import TournamentPanel from "./components/TournamentPanel";
import LeagueMeetingPanel from "./components/LeagueMeetingPanel";
import TrainingPanel from "./components/TrainingPanel";
import type { FieldPath } from "react-hook-form";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

type DetailedInfoStepProps = {
  setNextStep: () => void;
  setPrevStep: () => void;
};

type T =
  | "allWithin"
  | EventType.TOURNAMENT
  | `get${EventType.LEAGUE_MEETING}`
  | EventType.TRAINING;

type F = FieldPath<AddEventSchemaType>[];

export const detailedInfoStepFields = {
  allWithin: ["additionalDescription"] satisfies F,
  TOURNAMENT: ["data.tournamentType", "data.arbiter"] satisfies F,
  getLEAGUE_MEETING: (max: number) => {
    const res = ["data.tournamentType"];
    for (let i = 0; i < max; i++) {
      res.push(
        `data.session.${i}.contestants.firstPair.first`,
        `data.session.${i}.contestants.firstPair.second`,
        `data.session.${i}.contestants.secondPair.first`,
        `data.session.${i}.contestants.secondPair.second`
      );
    }
    return res;
  },
  TRAINING: ["data.coach", "data.topic"] satisfies F,
} satisfies Record<T, unknown>;

export function DetailedInfoStep({
  setNextStep,
  setPrevStep,
}: DetailedInfoStepProps) {
  const form = useFormContext<AddEventSchemaType>();
  const tValidation = useTranslationsWithFallback();

  const selectedGroup = form.watch("group");

  const peopleQ = useActionQuery({
    queryKey: QUERY_KEYS.group(selectedGroup),
    action: () => getGroupData({ groupId: selectedGroup }),
    enabled: !!selectedGroup,
  });

  const dataType = form.getValues().data.type;

  const handleNextStep = async () => {
    let ok = false;
    const commonFields = [
      "additionalDescription",
    ] satisfies FieldPath<AddEventSchemaType>[];
    switch (dataType) {
      case EventType.TOURNAMENT: {
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
    if (ok) setNextStep();
  };

  return (
    <Stack spacing={4}>
      {dataType === EventType.TOURNAMENT ? (
        <TournamentPanel
          people={peopleQ.data?.members ?? []}
          isPeopleLoading={!!!peopleQ.data || peopleQ.isLoading}
        />
      ) : dataType === EventType.LEAGUE_MEETING ? (
        <LeagueMeetingPanel
          people={peopleQ.data?.members ?? []}
          isPeopleLoading={!!!peopleQ.data || peopleQ.isLoading}
        />
      ) : dataType === EventType.TRAINING ? (
        <>
          <TrainingPanel
            people={peopleQ.data?.members ?? []}
            isPeopleLoading={!!!peopleQ.data || peopleQ.isLoading}
          />
        </>
      ) : (
        <></>
      )}
      <Controller
        control={form.control}
        name="additionalDescription"
        render={({ field, fieldState: { error } }) => (
          <FormInput
            placeholder="Dodatkowy opis wydarzenia"
            errorMessage={tValidation(error?.message)}
            isInvalid={!!error}
            type="textarea"
            id={field.name}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <HStack justifyContent="space-between" width="100%">
        <Button
          variant="outline"
          onClick={setPrevStep}
          leftIcon={<MdArrowBackIos />}
        >
          Cofnij
        </Button>
        <Button
          colorScheme="blue"
          onClick={handleNextStep}
          alignSelf="flex-end"
          rightIcon={<MdArrowForwardIos />}
        >
          Dalej
        </Button>
      </HStack>
    </Stack>
  );
}
