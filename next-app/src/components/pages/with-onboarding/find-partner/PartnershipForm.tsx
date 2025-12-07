"use client";

import React from "react";
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
import { createPartnershipPost } from "@/services/find-partner/api";
import { addPartnershipPostSchema } from "@/schemas/pages/with-onboarding/partnership-posts/partnership-posts-schema";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import type {
  ActionInput,
  MutationOrQuerryError,
} from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import { QUERY_KEYS } from "@/lib/queries";
import FormInput from "@/components/common/form/FormInput";
import SelectInput from "@/components/common/form/SelectInput";
import { useQueryStates, parseAsString } from "nuqs";
import { withEmptyToUndefined } from "@/schemas/common";
import { useJoinedGroupsQuery } from "@/lib/queries";

export default function PartnershipForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const t = useTranslations("pages.FindPartner.PartnershipForm");
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
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(withEmptyToUndefined(addPartnershipPostSchema)),
    defaultValues: {
      name: "",
      description: "",
      biddingSystem: BiddingSystem.SAYC,
      groupId: filters.groupId || "",
      data: {
        type: PartnershipPostType.PERIOD,
        startsAt: new Date(),
        endsAt: new Date(),
      },
    },
  });

  const createAction = useActionMutation({
    action: createPartnershipPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.partnershipPosts({}),
      });
      setFilters({ groupId: data.groupId });
      onClose();
    },
    onError: (err) => {
      const hasNameError = Boolean(err?.validationErrors?.name);
      if (hasNameError) {
        setFormError("name", {
          type: "server",
          message: err.validationErrors?.name?._errors?.[0],
        });
      }
    },
  });

  function handleWithToast(data: ActionInput<typeof createPartnershipPost>) {
    const promise = createAction.mutateAsync(data);
    toast.promise(promise, {
      loading: { title: t("toast.loading") || "Tworzenie ogłoszenia..." },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof createAction>) => {
        const errKey = getMessageKeyFromError(err);
        return { title: tValidation(errKey) };
      },
    });
  }

  const dataType = watch("data.type");

  return (
    <>
      <Button onClick={onOpen} colorScheme="accent">
        {t("addButton")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("modalHeader")}</ModalHeader>
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
                          options={[
                            {
                              value: "691b834873fb688327d065b6",
                              label: t(
                                "exampleEvents.691b834873fb688327d065b6"
                              ),
                            },
                            {
                              value: "some-other-event-id",
                              label: t("exampleEvents.some-other-event-id"),
                            },
                          ]}
                          errorMessage={tValidation(error?.message)}
                          isInvalid={!!error}
                        />
                      </Box>
                    )}
                  />
                )}

                {dataType === PartnershipPostType.PERIOD && (
                  <HStack spacing={3} align="flex-start">
                    <Controller
                      control={formControl}
                      name="data.startsAt"
                      render={({ field, fieldState: { error } }) => (
                        <Box flex={1}>
                          <FormLabel htmlFor="startsAt">
                            {t("startsAtLabel")}
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
                      name="data.endsAt"
                      render={({ field, fieldState: { error } }) => (
                        <Box flex={1}>
                          <FormLabel htmlFor="endsAt">
                            {t("endsAtLabel")}
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
                )}
              </Stack>

              <ModalFooter px={0} mt={4}>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  {t("cancelButton")}
                </Button>
                <Button
                  colorScheme="accent"
                  type="submit"
                  isLoading={createAction.isPending}
                >
                  {t("createButton")}
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
