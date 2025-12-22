"use client";

import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Divider,
  ModalBody,
  ModalFooter,
  FormLabel,
  RadioGroup,
  HStack,
  Radio,
  Box,
  useDisclosure,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  BiddingSystem,
  PartnershipPostType,
} from "@/club-preset/partnership-post";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import {
  createPartnershipPost,
  modifyPartnershipPost,
} from "@/services/find-partner/api";
import { listEventsForGroup } from "@/services/events/api";
import {
  addPartnershipPostSchema,
  modifyPartnershipPostSchema,
} from "@/schemas/pages/with-onboarding/partnership-posts/partnership-posts-schema";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { useActionQuery } from "@/lib/tanstack-action/actions-querry";
import type {
  ActionInput,
  MutationOrQuerryError,
} from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import FormInput from "@/components/common/form/FormInput";
import SelectInput from "@/components/common/form/SelectInput";
import { useQueryStates, parseAsString } from "nuqs";
import { withEmptyToUndefined } from "@/schemas/common";
import { useJoinedGroupsQuery } from "@/lib/queries";
import dayjs from "dayjs";
import type { AddPartnershipPostSchemaType } from "@/schemas/pages/with-onboarding/partnership-posts/partnership-posts-types";

type CreateModifyPartnershipFormProps = {
  mode?: "create" | "modify";
  partnershipPostId?: string;
  initialData?: AddPartnershipPostSchemaType;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function CreateModifyPartnershipForm({
  mode = "create",
  partnershipPostId,
  initialData,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}: CreateModifyPartnershipFormProps = {}) {
  const internalDisclosure = useDisclosure();
  const isOpen = controlledIsOpen ?? internalDisclosure.isOpen;
  const onOpen = internalDisclosure.onOpen;
  const onClose = controlledOnClose ?? internalDisclosure.onClose;

  const toast = useToast();
  const queryClient = useQueryClient();

  const isModifyMode = mode === "modify";

  const t = useTranslations("pages.FindPartner.CreateModifyPartnershipForm");
  const tBiddingSystem = useTranslations("common.biddingSystem");
  const tValidation = useTranslationsWithFallback();

  const [filters, setFilters] = useQueryStates({
    groupId: parseAsString,
  });

  const groupsQuery = useJoinedGroupsQuery();

  const {
    handleSubmit: handleFormSubmit,
    control: formControl,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(
      withEmptyToUndefined(
        isModifyMode ? modifyPartnershipPostSchema : addPartnershipPostSchema
      )
    ),
    defaultValues: initialData || {
      name: "",
      description: "",
      biddingSystem: BiddingSystem.SAYC,
      groupId: filters.groupId || "",
      data: {
        type: PartnershipPostType.PERIOD,
        duration: {
          startsAt: new Date(),
          endsAt: dayjs().add(1, "week").toDate(),
        },
      },
    },
  });

  useEffect(() => {
    if (isModifyMode && initialData) {
      reset(initialData);
    } else if (!isModifyMode) {
      reset({
        name: "",
        description: "",
        biddingSystem: BiddingSystem.SAYC,
        groupId: filters.groupId || "",
        data: {
          type: PartnershipPostType.PERIOD,
          duration: {
            startsAt: new Date(),
            endsAt: dayjs().add(1, "week").toDate(),
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModifyMode, initialData, reset]);

  const selectedGroupId = watch("groupId");
  const dataType = watch("data.type");
  const durationStart = watch("data.duration.startsAt");
  const durationEnd = watch("data.duration.endsAt");

  const eventsQuery = useActionQuery({
    queryKey: ["events", selectedGroupId, durationStart, durationEnd],
    action: () =>
      listEventsForGroup({
        groupId: selectedGroupId,
        timeWindow: {
          start: durationStart || new Date(),
          end: durationEnd || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      }),
    enabled: !!selectedGroupId && dataType === PartnershipPostType.SINGLE,
  });

  type PartnershipActionInput =
    | {
        mode: "create";
        data: ActionInput<typeof createPartnershipPost>;
      }
    | {
        mode: "modify";
        data: ActionInput<typeof modifyPartnershipPost>;
      };

  const partnershipAction = useActionMutation({
    action: ({ mode, data }: PartnershipActionInput) => {
      if (mode === "create") {
        return createPartnershipPost(data);
      }
      return modifyPartnershipPost(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["partnershipPosts", data.groupId],
      });
      if (!isModifyMode) {
        setFilters({ groupId: data.groupId });
      }
      onClose();
      reset();
    },
  });

  function handleWithToast(
    data: AddPartnershipPostSchemaType | Partial<AddPartnershipPostSchemaType>
  ) {
    const promise =
      isModifyMode && partnershipPostId
        ? partnershipAction.mutateAsync({
            mode: "modify",
            data: {
              ...data,
              partnershipPostId,
              groupId: data.groupId || selectedGroupId,
            },
          })
        : partnershipAction.mutateAsync({
            mode: "create",
            data: {
              ...data,
              groupId: data.groupId || selectedGroupId,
            } as ActionInput<typeof createPartnershipPost>,
          });

    toast.promise(promise, {
      loading: {
        title: isModifyMode ? t("toast.modify.loading") : t("toast.loading"),
      },
      success: {
        title: isModifyMode ? t("toast.modify.success") : t("toast.success"),
      },
      error: (err: MutationOrQuerryError<typeof partnershipAction>) => {
        const errKey = getMessageKeyFromError(err);
        return { title: tValidation(errKey) };
      },
    });
  }

  return (
    <>
      {!isModifyMode && (
        <Button onClick={onOpen} colorScheme="accent">
          {t("addButton")}
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isModifyMode ? t("modalHeaderModify") : t("modalHeader")}
          </ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <form onSubmit={handleFormSubmit(handleWithToast)}>
              <Stack spacing={3}>
                <Controller
                  control={formControl}
                  name="name"
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <FormLabel htmlFor="name">{t("nameLabel")}</FormLabel>
                      <FormInput
                        id="name"
                        type="text"
                        placeholder={t("nameLabel")}
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={tValidation(error?.message)}
                        isInvalid={!!error}
                      />
                    </Box>
                  )}
                />

                <Controller
                  control={formControl}
                  name="description"
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <FormLabel htmlFor="description">
                        {t("descriptionLabel")}
                      </FormLabel>
                      <FormInput
                        id="description"
                        type="textarea"
                        placeholder={t("descriptionLabel")}
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={tValidation(error?.message)}
                        isInvalid={!!error}
                      />
                    </Box>
                  )}
                />

                <Controller
                  control={formControl}
                  name="groupId"
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <FormLabel htmlFor="groupId">{t("groupLabel")}</FormLabel>
                      <SelectInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("groupPlaceholder")}
                        options={(groupsQuery.data ?? []).map((group) => ({
                          value: group.id,
                          label: group.name,
                        }))}
                        errorMessage={tValidation(error?.message)}
                        isInvalid={!!error}
                        isLoading={groupsQuery.isLoading}
                      />
                    </Box>
                  )}
                />

                <Controller
                  control={formControl}
                  name="biddingSystem"
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <FormLabel htmlFor="biddingSystem">
                        {t("biddingSystemLabel")}
                      </FormLabel>
                      <SelectInput
                        value={field.value}
                        onChange={field.onChange}
                        options={Object.values(BiddingSystem).map((v) => ({
                          value: v,
                          label: tBiddingSystem(v),
                        }))}
                        errorMessage={tValidation(error?.message)}
                        isInvalid={!!error}
                      />
                    </Box>
                  )}
                />

                <Controller
                  control={formControl}
                  name="data.type"
                  render={({ field }) => (
                    <Box>
                      <FormLabel>{t("typeLabel")}</FormLabel>
                      <RadioGroup value={field.value} onChange={field.onChange}>
                        <HStack spacing={4}>
                          <Radio value={PartnershipPostType.SINGLE}>
                            {t("single")}
                          </Radio>
                          <Radio value={PartnershipPostType.PERIOD}>
                            {t("period")}
                          </Radio>
                        </HStack>
                      </RadioGroup>
                    </Box>
                  )}
                />

                <HStack spacing={3} align="flex-start">
                  <Controller
                    control={formControl}
                    name="data.duration.startsAt"
                    render={({ field, fieldState: { error } }) => (
                      <Box flex={1}>
                        <FormLabel htmlFor="startsAt">
                          {dataType === PartnershipPostType.SINGLE
                            ? t("timeWindowStartLabel")
                            : t("startsAtLabel")}
                        </FormLabel>
                        <FormInput
                          id="startsAt"
                          type="datetime"
                          placeholder={t("startsAtLabel")}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            field.onChange(date);
                          }}
                          errorMessage={tValidation(error?.message)}
                          isInvalid={!!error}
                        />
                      </Box>
                    )}
                  />
                  <Controller
                    control={formControl}
                    name="data.duration.endsAt"
                    render={({ field, fieldState: { error } }) => (
                      <Box flex={1}>
                        <FormLabel htmlFor="endsAt">
                          {dataType === PartnershipPostType.SINGLE
                            ? t("timeWindowEndLabel")
                            : t("endsAtLabel")}
                        </FormLabel>
                        <FormInput
                          id="endsAt"
                          type="datetime"
                          placeholder={t("endsAtLabel")}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            field.onChange(date);
                          }}
                          errorMessage={tValidation(error?.message)}
                          isInvalid={!!error}
                        />
                      </Box>
                    )}
                  />
                </HStack>

                {dataType === PartnershipPostType.SINGLE && (
                  <Controller
                    control={formControl}
                    name="data.eventId"
                    render={({ field, fieldState: { error } }) => (
                      <Box>
                        <FormLabel htmlFor="eventId">
                          {t("eventIdLabel")}
                        </FormLabel>
                        <SelectInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("eventPlaceholder")}
                          options={
                            eventsQuery.data?.map(
                              (event: { id: string; title: string }) => ({
                                value: event.id,
                                label: event.title,
                              })
                            ) ?? []
                          }
                          errorMessage={tValidation(error?.message)}
                          isInvalid={!!error}
                          isLoading={eventsQuery.isLoading}
                        />
                      </Box>
                    )}
                  />
                )}
              </Stack>

              <ModalFooter px={0} mt={4}>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  {t("cancelButton")}
                </Button>
                <Button
                  colorScheme="accent"
                  type="submit"
                  isLoading={partnershipAction.isPending}
                >
                  {isModifyMode ? t("modifyButton") : t("createButton")}
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
