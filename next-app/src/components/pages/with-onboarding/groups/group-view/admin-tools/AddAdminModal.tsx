"use client";

import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { TKey } from "@/lib/typed-translations";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import { addAdminToGroup } from "@/services/groups/api";
import SelectInput from "@/components/common/form/SelectInput";
import FormMainButton from "@/components/common/form/FormMainButton";
import { z } from "zod";
import type { GroupFullType } from "@/schemas/model/group/group-types";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import { withEmptyToUndefined } from "@/schemas/common";
import { getPersonLabel } from "@/util/formatters";

type AddAdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "remove";
  group: GroupFullType;
};

const addAdminSchema = z.object({
  userIdToPromote: z.string({
    message: "pages.GroupsPage.AddRemoveAdminModal.form.userSelect.required",
  }),
});

type FormValues = z.infer<typeof addAdminSchema>;

export default function AddAdminModal({
  isOpen,
  onClose,
  group,
}: AddAdminModalProps) {
  const t = useTranslations("pages.GroupsPage.AddRemoveAdminModal");
  const tValidation = useTranslationsWithFallback();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(withEmptyToUndefined(addAdminSchema)),
  });

  const adminCandidates = group.members.filter(
    (m) => !group.admins.some((a) => a.id === m.id)
  );

  const addAdminAction = useActionMutation({
    action: addAdminToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      reset();
      onClose();
    },
  });

  const onSubmit = (values: FormValues) => {
    const promise = addAdminAction.mutateAsync({
      groupId: group.id,
      userIdToPromote: values.userIdToPromote,
    });
    toast.promise(promise, {
      loading: { title: t("add.toast.loading") },
      success: { title: t("add.toast.success") },
      error: (err: MutationOrQuerryError<typeof addAdminAction>) => {
        const errKey = getMessageKeyFromError(err, {
          generalErrorKey:
            "pages.GroupsPage.AddRemoveAdminModal.add.toast.errorDefault" satisfies TKey,
        });
        return { title: tValidation(errKey) };
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("add.header")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} mt={2}>
              <Controller
                control={control}
                name="userIdToPromote"
                render={({ field, fieldState: { error } }) => (
                  <SelectInput
                    emptyValueLabel={t("form.userSelect.placeholder")}
                    options={adminCandidates.map((m) => ({
                      label: getPersonLabel(m),
                      value: m.id,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    errorMessage={tValidation(error?.message)}
                    isInvalid={!!error}
                  />
                )}
              />

              <FormMainButton
                text={t("form.submitButton")}
                type="submit"
                onElementProps={{
                  isLoading: addAdminAction.isPending,
                }}
              />
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("form.cancelButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
