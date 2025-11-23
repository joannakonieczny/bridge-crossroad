"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Stack,
  useToast,
  Button,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import FormInput from "@/components/common/form/FormInput";
import FormMainButton from "@/components/common/form/FormMainButton";
import { createGroupFormSchema } from "@/schemas/pages/with-onboarding/groups/groups-schema";
import { createNewGroup } from "@/services/groups/api";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import type { CreateGroupFormType } from "@/schemas/pages/with-onboarding/groups/groups-types";
import { withEmptyToUndefined } from "@/schemas/common";

type AddGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddGroupModal({ isOpen, onClose }: AddGroupModalProps) {
  const toast = useToast();
  const t = useTranslations("pages.GroupsPage.AddGroupModal");
  const tValidation = useTranslationsWithFallback();

  const queryClient = useQueryClient();

  const { handleSubmit, control, setError, reset } = useForm({
    resolver: zodResolver(withEmptyToUndefined(createGroupFormSchema)),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const createGroupAction = useActionMutation({
    action: createNewGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.joinedGroups });
      reset();
    },
    onError: (err) => {
      const errKey = getMessageKeyFromError(err);
      setError("name", { type: "server", message: errKey });
    },
  });

  const onSubmit = (data: CreateGroupFormType) => {
    onClose();
    const promise = createGroupAction.mutateAsync(data);

    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof createGroupAction>) => {
        const errKey = getMessageKeyFromError(err, {
          generalErrorKey: "pages.GroupsPage.AddGroupModal.toast.errorDefault",
        });
        return { title: tValidation(errKey) };
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("header")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} mt={4}>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <FormInput
                    placeholder={t("form.name.placeholder")}
                    errorMessage={tValidation(error?.message)}
                    isInvalid={!!error}
                    id="name"
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState: { error } }) => (
                  <FormInput
                    type="textarea"
                    placeholder={t("form.description.placeholder")}
                    errorMessage={tValidation(error?.message)}
                    isInvalid={!!error}
                    id="description"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <FormMainButton text={t("submitButton")} type="submit" />
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("cancelButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
