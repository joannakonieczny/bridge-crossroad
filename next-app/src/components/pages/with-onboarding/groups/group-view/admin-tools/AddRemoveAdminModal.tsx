"use client";

import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
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
import {
  promoteMemberToAdmin,
  demoteAdminToMember,
} from "@/services/groups/api";
import SelectInput from "@/components/common/form/SelectInput";
import FormMainButton from "@/components/common/form/FormMainButton";
import { z } from "zod";
import type { GroupFullType } from "@/schemas/model/group/group-types";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import { withEmptyToUndefined } from "@/schemas/common";
import { getPersonLabel } from "@/util/formatters";

type AddRemoveAdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "remove";
  group: GroupFullType;
};

const addAdminSchema = z.object({
  userIdToPromote: z.string({
    message:
      "pages.GroupsPage.AddRemoveAdminModal.form.userSelect.required" satisfies TKey,
  }),
});

const removeAdminSchema = z.object({
  userIdToDemote: z.string({
    message:
      "pages.GroupsPage.AddRemoveAdminModal.form.userSelect.required" satisfies TKey,
  }),
});

type AddFormValues = z.infer<typeof addAdminSchema>;
type RemoveFormValues = z.infer<typeof removeAdminSchema>;

type AdminActionInput =
  | {
      mode: "add";
      values: AddFormValues;
    }
  | {
      mode: "remove";
      values: RemoveFormValues;
    };

export default function AddRemoveAdminModal({
  isOpen,
  onClose,
  mode,
  group,
}: AddRemoveAdminModalProps) {
  const t = useTranslations("pages.GroupsPage.AddRemoveAdminModal");
  const tValidation = useTranslationsWithFallback();
  const toast = useToast();
  const queryClient = useQueryClient();

  const isAddMode = mode === "add";

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(
      withEmptyToUndefined(isAddMode ? addAdminSchema : removeAdminSchema)
    ),
  });

  const userOptions = isAddMode
    ? group.members.filter((m) => !group.admins.some((a) => a.id === m.id))
    : group.admins;

  const adminAction = useActionMutation({
    action: ({ mode, values }: AdminActionInput) => {
      if (mode === "add") {
        return promoteMemberToAdmin({
          groupId: group.id,
          userIdToPromote: values.userIdToPromote,
        });
      }
      return demoteAdminToMember({
        groupId: group.id,
        userIdToDemote: values.userIdToDemote,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      reset();
      onClose();
    },
  });

  const onSubmit = (values: AddFormValues | RemoveFormValues) => {
    const promise = isAddMode
      ? adminAction.mutateAsync({
          mode: "add",
          values: values as AddFormValues,
        })
      : adminAction.mutateAsync({
          mode: "remove",
          values: values as RemoveFormValues,
        });

    toast.promise(promise, {
      loading: { title: t(`${mode}.toast.loading`) },
      success: { title: t(`${mode}.toast.success`) },
      error: (err: MutationOrQuerryError<typeof adminAction>) => {
        const errKey = getMessageKeyFromError(err, {
          generalErrorKey:
            `pages.GroupsPage.AddRemoveAdminModal.${mode}.toast.errorDefault` satisfies TKey,
        });

        return { title: tValidation(errKey) };
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t(`${mode}.header`)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} mt={2}>
              <Controller
                control={control}
                name={isAddMode ? "userIdToPromote" : "userIdToDemote"}
                render={({ field, fieldState: { error } }) => (
                  <SelectInput
                    emptyValueLabel={t("form.userSelect.placeholder")}
                    options={userOptions.map((m) => ({
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
                text={t(`${mode}.submitButton`)}
                type="submit"
                onElementProps={{
                  isLoading: adminAction.isPending,
                }}
              />
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
