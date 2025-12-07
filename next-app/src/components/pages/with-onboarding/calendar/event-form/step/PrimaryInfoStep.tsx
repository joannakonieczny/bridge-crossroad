"use client";

import { Controller, useFormContext } from "react-hook-form";
import { VStack, Stack, HStack, Text } from "@chakra-ui/react";
import { EventType } from "@/club-preset/event-type";
import FormInput from "@/components/common/form/FormInput";
import {
  useTranslationsWithFallback,
  useTranslations,
} from "@/lib/typed-translations";
import SelectInput from "@/components/common/form/SelectInput";
import dayjs from "dayjs";
import {
  useGroupQuery,
  useJoinedGroupsAsAdminQuery,
  useUserInfoQuery,
} from "@/lib/queries";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import { getPersonLabel } from "@/util/formatters";
import { useEffect } from "react";

export function PrimaryInfoStep() {
  const form = useFormContext<AddEventSchemaType>();

  const t = useTranslations("pages.EventFormPage");
  const tEvents = useTranslations("common.eventType");
  const tValidation = useTranslationsWithFallback();

  const selectedGroup = (form.watch("group") || null) as GroupIdType | null;

  const groupsQ = useJoinedGroupsAsAdminQuery();
  const peopleQ = useGroupQuery(selectedGroup);
  const ownInfoQ = useUserInfoQuery();

  useEffect(() => {
    if (ownInfoQ.data?.id && !form.getValues("organizer")) {
      form.setValue("organizer", ownInfoQ.data.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownInfoQ.data?.id]);

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
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    );
  }

  function RenderSelectInput(p: {
    name: "group" | "organizer" | "data.type";
    placeholder?: string;
    options: { value: string; label: string }[];
    isLoading?: boolean;
    isDisabled?: boolean;
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
            value={field.value}
            isLoading={p.isLoading}
            isDisabled={p.isDisabled}
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
        placeholder={t("primaryInfoStep.titlePlaceholder")}
        type="text"
      />
      <RenderFormInput
        name="description"
        placeholder={t("primaryInfoStep.descriptionPlaceholder")}
        type="text"
      />
      {!selectedGroup && (
        <Stack>
          <Text fontSize="sm" textColor={"gray.500"}>
            {t("primaryInfoStep.groupWarning.selectGroup")}
          </Text>
          <Text fontSize="sm" textColor={"gray.500"}>
            {t("primaryInfoStep.groupWarning.organizerNote")}
          </Text>
        </Stack>
      )}
      <RenderSelectInput
        name="group"
        placeholder={t("primaryInfoStep.groupPlaceholder")}
        options={(groupsQ.data ?? []).map((group) => ({
          value: group.id,
          label: group.name,
        }))}
        isLoading={groupsQ.isLoading}
      />
      <Stack>
        <Text color="gray.500" fontSize="sm">
          {t("primaryInfoStep.organizerPlaceholder")}
        </Text>
        <RenderSelectInput
          name="organizer"
          placeholder={t("primaryInfoStep.organizerPlaceholder")}
          options={(peopleQ.data?.members ?? []).map((member) => ({
            value: member.id,
            label: getPersonLabel(member),
          }))}
          isLoading={
            !!!selectedGroup ? false : peopleQ.isLoading || ownInfoQ.isLoading
          }
          isDisabled={!!!selectedGroup}
        />
      </Stack>

      <HStack spacing={4}>
        <VStack flex={1}>
          <Text color="gray.500" alignSelf="start" fontSize="sm">
            {t("primaryInfoStep.eventStartPlaceholder")}
          </Text>
          <RenderDateTimeInput
            name="duration.startsAt"
            placeholder={t("primaryInfoStep.eventStartPlaceholder")}
          />
        </VStack>
        <VStack flex={1}>
          <Text color="gray.500" alignSelf="start" fontSize="sm">
            {t("primaryInfoStep.eventEndPlaceholder")}
          </Text>
          <RenderDateTimeInput
            name="duration.endsAt"
            placeholder={t("primaryInfoStep.eventEndPlaceholder")}
          />
        </VStack>
      </HStack>
      <Stack>
        <Text color="gray.500" alignSelf="start" fontSize="sm">
          {t("primaryInfoStep.eventTypePlaceholder")}
        </Text>
        <RenderSelectInput
          name="data.type"
          options={Object.values(EventType).map((type) => ({
            value: type,
            label: tEvents(type),
          }))}
        />
      </Stack>
    </Stack>
  );
}
