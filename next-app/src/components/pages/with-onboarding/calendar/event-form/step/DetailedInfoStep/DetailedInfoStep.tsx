"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Stack, HStack, Button } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import FormInput from "@/components/common/form/FormInput";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { QUERY_KEYS } from "@/lib/query-keys";
import { getGroupData } from "@/services/groups/api";
// SessionEditor is used inside LeagueMeetingPanel
import TournamentPanel from "./components/TournamentPanel";
import LeagueMeetingPanel from "./components/LeagueMeetingPanel";
import TrainingPanel from "./components/TrainingPanel";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

type DetailedInfoStepProps = {
  setNextStep: () => void;
  setPrevStep: () => void;
};

export function DetailedInfoStep({
  setNextStep,
  setPrevStep,
}: DetailedInfoStepProps) {
  const form = useFormContext<AddEventSchemaType>();
  const selectedGroup = form.watch("group");

  const peopleQ = useActionQuery({
    queryKey: QUERY_KEYS.group(selectedGroup),
    action: () => getGroupData({ groupId: selectedGroup }),
    enabled: !!selectedGroup,
  });

  const dataType = form.getValues().data.type;

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
          <TrainingPanel people={peopleQ.data?.members ?? []} />
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
            errorMessage="Niepoprawne coś tam coś"
            isInvalid={!!error}
            id="additionalDescription"
            type="textarea"
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
          onClick={async () => {
            setNextStep();
            // TODO add step validation
          }}
          alignSelf="flex-end"
          rightIcon={<MdArrowForwardIos />}
        >
          Dalej
        </Button>
      </HStack>
    </Stack>
  );
}
