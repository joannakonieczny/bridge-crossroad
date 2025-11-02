"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  VStack,
  Radio,
  RadioGroup,
  Wrap,
  Stack,
  Button,
  Select,
  HStack,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import FormInput from "@/components/common/form/FormInput";
import { MdArrowForwardIos } from "react-icons/md";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import { QUERY_KEYS } from "@/lib/query-keys";
import { getGroupData, getJoinedGroupsInfo } from "@/services/groups/api";
import { useState } from "react";
import { useTranslationsWithFallback } from "@/lib/typed-translations";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

type PrimaryInfoStepProps = {
  activeStep: number;
  setActiveStep: (n: number) => void;
};

export default function PrimaryInfoStep({
  activeStep,
  setActiveStep,
}: PrimaryInfoStepProps) {
  const { control } = useFormContext<AddEventSchemaType>();
  const [selectedGroup, setSelectedGroup] = useState<GroupIdType | "">("");
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
    name: keyof AddEventSchemaType;
    placeholder: string;
    type: "text" | "textarea";
  }) {
    return (
      <Controller
        control={control}
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
        type="textarea"
      />
      <RenderFormInput
        name="description"
        placeholder="Opis wydarzenia"
        type="text"
      />
      <Controller
        control={control}
        name="group"
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            {error && (
              <FormErrorMessage mb={2}>
                Nie wybrano grupy dla wydarzenia
              </FormErrorMessage>
            )}
            <Select
              placeholder="Grupa"
              id="group"
              value={field.value as unknown as string}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {(groupsQ.data ?? []).map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="organizer"
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            {error && (
              <FormErrorMessage mb={2}>
                Nie wybrano grupy dla wydarzenia
              </FormErrorMessage>
            )}
            <Select
              placeholder="Organizator"
              id="organizer"
              value={field.value as unknown as string}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {(peopleQ.data?.members ?? []).map((member) => (
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
      <HStack spacing={4}>
        <VStack flex={1}>
          <Text color="gray.500" alignSelf="start">
            Początek wydarzenia
          </Text>
          <Controller
            control={control}
            name="duration.startsAt"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder="Start wydarzenia"
                errorMessage="Niepoprawne coś tam coś"
                isInvalid={!!error}
                id="startsAt"
                type="datetime"
                value={(field.value as Date).toString()}
                onChange={field.onChange}
              />
            )}
          />
        </VStack>
        <VStack flex={1}>
          <Text color="gray.500" alignSelf="start">
            Koniec wydarzenia
          </Text>
          <Controller
            control={control}
            name="duration.endsAt"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder="Koniec wydarzenia"
                errorMessage="Niepoprawne coś tam coś"
                isInvalid={!!error}
                id="endsAt"
                type="datetime"
                value={(field.value as Date).toString()}
                onChange={field.onChange}
              />
            )}
          />
        </VStack>
      </HStack>
      <Text color="gray.500" alignSelf="start">
        Typ Wydarzenia
      </Text>
      <Controller
        control={control}
        name="data.type"
        render={({ field, fieldState: { error } }) => (
          <FormControl as="fieldset" isInvalid={!!error}>
            {error && (
              <FormErrorMessage mb={2}>
                Niepoprawny typ wydarzenia
              </FormErrorMessage>
            )}
            <RadioGroup
              onChange={(value) => field.onChange(value as EventType)}
              value={field.value as unknown as string}
            >
              <Wrap spacing="1rem">
                <Radio value={EventType.TOURNAMENT}>TOURNAMENT</Radio>
                <Radio value={EventType.LEAGUE_MEETING}>LEAGUE_MEETING</Radio>
                <Radio value={EventType.TRAINING}>TRAINING</Radio>
                <Radio value={EventType.OTHER}>OTHER</Radio>
              </Wrap>
            </RadioGroup>
          </FormControl>
        )}
      />
      <Button
        colorScheme="blue"
        onClick={async () => {
          setActiveStep(activeStep + 1);
        }}
        alignSelf="flex-end"
        rightIcon={<MdArrowForwardIos />}
      >
        Dalej
      </Button>
    </Stack>
  );
}
