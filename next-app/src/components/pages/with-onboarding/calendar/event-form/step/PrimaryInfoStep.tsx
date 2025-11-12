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
import { getPersonLabel } from "../util/helpers";
import { SteeringButtons } from "../components/SteeringButtons";
import {
  useGroupQuery,
  useJoinedGroupsAsAdminQuery,
  useUserInfoQuery,
} from "@/lib/queries";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import type { StepProps } from "../util/helpers";
import { useEffect } from "react";

export function PrimaryInfoStep({ setNextStep }: StepProps) {
  const form = useFormContext<AddEventSchemaType>();

  const t = useTranslations("pages.EventFormPage.primaryInfo");
  const tEvents = useTranslations("common.eventType");
  const tValidation = useTranslationsWithFallback();

  const selectedGroup = form.watch("group") as GroupIdType | "";

  const groupsQ = useJoinedGroupsAsAdminQuery();
  const peopleQ = useGroupQuery(selectedGroup);
  const ownInfoQ = useUserInfoQuery();

  useEffect(() => {
    if (ownInfoQ.data?.id && !form.getValues("organizer")) {
      form.setValue("organizer", ownInfoQ.data.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownInfoQ.data?.id]);

  const handleNextStep = async () => {
    const ok = await form.trigger([
      "title",
      "description",
      "group",
      "organizer",
      "data.type",
      "duration.startsAt",
      "duration.endsAt",
    ]);
    if (ok) setNextStep?.();
  };

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
    placeholder: string;
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
        placeholder={t("titlePlaceholder")}
        type="text"
      />
      <RenderFormInput
        name="description"
        placeholder={t("descriptionPlaceholder")}
        type="text"
      />
      <RenderSelectInput
        name="group"
        placeholder={t("groupPlaceholder")}
        options={(groupsQ.data ?? []).map((group) => ({
          value: group.id,
          label: group.name,
        }))}
        isLoading={groupsQ.isLoading}
      />
      <RenderSelectInput
        name="organizer"
        placeholder={t("organizerPlaceholder")}
        options={(peopleQ.data?.members ?? []).map((member) => ({
          value: member.id,
          label: getPersonLabel(member),
        }))}
        isLoading={
          !!!selectedGroup ? false : peopleQ.isLoading || ownInfoQ.isLoading
        }
        isDisabled={!!!selectedGroup}
      />
      <HStack spacing={4}>
        <VStack flex={1}>
          <Text color="gray.500" alignSelf="start">
            {t("eventStartPlaceholder")}
          </Text>
          <RenderDateTimeInput
            name="duration.startsAt"
            placeholder={t("eventStartPlaceholder")}
          />
        </VStack>
        <VStack flex={1}>
          <Text color="gray.500" alignSelf="start">
            {t("eventEndPlaceholder")}
          </Text>
          <RenderDateTimeInput
            name="duration.endsAt"
            placeholder={t("eventEndPlaceholder")}
          />
        </VStack>
      </HStack>
      <Text color="gray.500" alignSelf="start">
        {t("eventTypePlaceholder")}
      </Text>
      <RenderSelectInput
        name="data.type"
        placeholder={t("eventTypePlaceholder")}
        options={Object.values(EventType).map((type) => ({
          value: type,
          label: `${tEvents(type)}`, //TODO add translations
        }))}
      />
      <SteeringButtons
        nextButton={{
          text: t("nextButton"), //TODO - translation
          onClick: () => handleNextStep(),
          onElementProps: {
            disabled:
              groupsQ.isLoading ||
              peopleQ.isLoading ||
              ownInfoQ.isLoading ||
              !selectedGroup,
          },
        }}
      />
    </Stack>
  );
}
