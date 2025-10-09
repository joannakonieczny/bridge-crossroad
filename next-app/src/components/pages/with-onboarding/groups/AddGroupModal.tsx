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
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import FormInput from "../../../common/form/FormInput";
import FormMainButton from "../../../common/form/FormMainButton";

import { z } from "zod";
import { createGroupFormSchema } from "@/schemas/pages/with-onboarding/groups/create-group-form-schema";
import { createNewGroup } from "@/services/groups/api";
import { useTranslations } from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";

export const GROUPS_QUERY_KEY = { groups: ["groups"] };

type CreateGroupInput = z.infer<typeof createGroupFormSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => Promise<void> | void;
};

export default function AddGroupModal({ isOpen, onClose, onCreated }: Props) {
  const toast = useToast();
  const t = useTranslations("pages.GroupsPage.AddGroupModal");
  const queryClient = useQueryClient();

  const { handleSubmit, control, setError, register } = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "https://blocks.astratic.com/img/general-img-portrait.png",
      invitationCode: "11111111",
    },
  });

  const createGroupAction = useActionMutation({
    action: createNewGroup,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEY.groups });
      try {
        await (onCreated ? onCreated() : undefined);
      } catch (e) {
        // ignore
      }
    },
    onError: (err) => {
      const errKey = getMessageKeyFromError(err);
      setError("name", { type: "server", message: errKey });
    },
  });

  const onSubmit = (data: CreateGroupInput) => {
    onClose(); 
    const promise = createGroupAction.mutateAsync(data);

    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof createGroupAction>) => {
        const errKey = getMessageKeyFromError(err);
        return { title: errKey || t("toast.errorDefault") };
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
              <input type="hidden" {...register("invitationCode")} />
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <FormInput
                    placeholder={t("form.name.placeholder")}
                    errorMessage={error?.message}
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
                    errorMessage={error?.message}
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
