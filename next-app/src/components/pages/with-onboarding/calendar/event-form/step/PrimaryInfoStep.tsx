"use client";

import { Controller, useFormContext } from "react-hook-form";
import { VStack, Stack, Button, HStack, Text } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import FormInput from "@/components/common/form/FormInput";
import { MdArrowForwardIos } from "react-icons/md";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { QUERY_KEYS } from "@/lib/query-keys";
import { getGroupData, getJoinedGroupsInfo } from "@/services/groups/api";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import SelectInput from "@/components/common/form/SelectInput";
import dayjs from "dayjs";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import { getPersonLabel } from "../util/helpers";

type PrimaryInfoStepProps = {
  setNextStep: () => void;
};

export function PrimaryInfoStep({ setNextStep }: PrimaryInfoStepProps) {
  const form = useFormContext<AddEventSchemaType>();
  const selectedGroup = form.watch("group") as GroupIdType | "";
  const tValidation = useTranslationsWithFallback();

  const groupsQ = useActionQuery({
    queryKey: QUERY_KEYS.groups,
    action: getJoinedGroupsInfo,
  });
  const peopleQ = useActionQuery({
    queryKey: QUERY_KEYS.group(selectedGroup),
    action: () => getGroupData({ groupId: selectedGroup }),
    enabled: !!selectedGroup,
  });

  function RenderFormInput(p: {
    name: "title" | "description";
    placeholder: string;
    type: "text" | "textarea";
  }) {
    return (
      <Controller
        control={form.control}
        name={p.name}
        render={({ field, fieldState: { error } }) => (
          <FormInput
            placeholder={p.placeholder}
            errorMessage={tValidation(error?.message)}
            isInvalid={!!error}
            id={p.name}
            type={p.type}
            value={field.value as string}
            onChange={field.onChange}
          />
        )}
      />
    );
  }

  function RenderSelectInput(p: {
    name: "group" | "organizer" | "data.type";
    placeholder: string;
    options: { value: string; label: string }[];
    isLoading?: boolean;
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
            options={p.options}
            value={field.value as string}
            isLoading={p.isLoading}
            onChange={field.onChange}
          />
        )}
      />
    );
  }

  function RenderDateTimeInput(p: {
    name: "duration.startsAt" | "duration.endsAt";
    placeholder: string;
  }) {
    return (
      <Controller
        control={form.control}
        name={p.name}
        render={({ field, fieldState: { error } }) => (
          <FormInput
            placeholder={p.placeholder}
            errorMessage={tValidation(error?.message)}
            isInvalid={!!error}
            id={p.name}
            type="datetime"
            value={
              field.value
                ? dayjs(field.value as unknown as Date).format(
                    "YYYY-MM-DDTHH:mm"
                  )
                : ""
            }
            onChange={(event) => {
              const parsed = event.target.value //should be string in format "YYYY-MM-DDTHH:mm"
                ? dayjs(event.target.value).toDate()
                : undefined;
              field.onChange(parsed);
            }}
          />
        )}
      />
    );
  }

  return (
    <Stack spacing={4}>
      <RenderFormInput
        name="title"
        placeholder="Tytuł wydarzenia"
        type="text"
      />
      <RenderFormInput
        name="description"
        placeholder="Opis wydarzenia"
        type="text"
      />
      <RenderSelectInput
        name="group"
        placeholder="Grupa"
        options={(groupsQ.data ?? []).map((group) => ({
          value: group.id,
          label: group.name,
        }))}
        isLoading={groupsQ.isLoading}
      />
      <RenderSelectInput
        name="organizer"
        placeholder="Organizator"
        options={(peopleQ.data?.members ?? []).map((member) => ({
          value: member.id,
          label: getPersonLabel(member),
        }))}
        isLoading={peopleQ.isLoading}
      />
      <HStack spacing={4}>
        <VStack flex={1}>
          <Text color="gray.500" alignSelf="start">
            Początek wydarzenia
          </Text>
          <RenderDateTimeInput
            name="duration.startsAt"
            placeholder="Start wydarzenia"
          />
        </VStack>
        <VStack flex={1}>
          <Text color="gray.500" alignSelf="start">
            Koniec wydarzenia
          </Text>
          <RenderDateTimeInput
            name="duration.endsAt"
            placeholder="Koniec wydarzenia"
          />
        </VStack>
      </HStack>
      <Text color="gray.500" alignSelf="start">
        Typ Wydarzenia
      </Text>
      <RenderSelectInput
        name="data.type"
        placeholder="Typ wydarzenia"
        options={Object.values(EventType).map((type) => ({
          value: type,
          label: type, //TODO add translations
        }))}
      />
      <Button
        colorScheme="blue"
        onClick={async () => {
          setNextStep();
          // TODO add step validation
        }}
        alignSelf="flex-end"
        rightIcon={<MdArrowForwardIos />}
        disabled={groupsQ.isLoading || peopleQ.isLoading}
      >
        Dalej
      </Button>
    </Stack>
  );
}
