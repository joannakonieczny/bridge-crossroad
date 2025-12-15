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
  useToast,
  Button,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import FormInput from "@/components/common/form/FormInput";
import FileUploader from "@/components/common/form/FileUploader/FileUploader";
import { useImageUpload } from "@/components/common/form/FileUploader/useImageUpload";
import FormMainButton from "@/components/common/form/FormMainButton";
import { createModifyGroupFormSchema } from "@/schemas/pages/with-onboarding/groups/groups-schema";
import { createNewGroup, modifyGroupData } from "@/services/groups/api";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries";
import type { MutationOrQuerryError } from "@/lib/tanstack-action/types";
import type { CreateGroupFormType } from "@/schemas/pages/with-onboarding/groups/groups-types";
import { withEmptyToUndefined } from "@/schemas/common";
import { useEffect } from "react";

type CreateModifyGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "modify";
  groupId?: string;
  initialData?: CreateGroupFormType;
};

type GroupActionInput =
  | {
      mode: "create";
      data: CreateGroupFormType;
    }
  | {
      mode: "modify";
      data: CreateGroupFormType & { groupId: string };
    };

export function CreateModifyGroupModal({
  isOpen,
  onClose,
  mode = "create",
  groupId,
  initialData,
}: CreateModifyGroupModalProps) {
  const toast = useToast();
  const t = useTranslations("pages.GroupsPage.AddModifyGroupModal");
  const tValidation = useTranslationsWithFallback();

  const queryClient = useQueryClient();
  const isModifyMode = mode === "modify";

  const {
    selectedImage,
    uploadImage,
    resetImage,
    handleImageChange,
    isUploading,
    isError: isUploadError,
  } = useImageUpload({
    text: {
      toast: {
        loading: { title: t("imageToast.loading") },
        success: { title: t("imageToast.success") },
        error: { title: t("imageToast.error") },
      },
    },
  });

  const { handleSubmit, control, setError, reset, setValue } = useForm({
    resolver: zodResolver(withEmptyToUndefined(createModifyGroupFormSchema)),
    defaultValues: initialData || {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (isModifyMode && initialData) {
      reset(initialData);
    }
  }, [isModifyMode, initialData, reset]);

  const groupAction = useActionMutation({
    action: ({ mode, data }: GroupActionInput) => {
      if (mode === "create") {
        return createNewGroup(data);
      }
      return modifyGroupData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.joinedGroups });
      reset();
      resetImage();
      onClose();
    },
    onError: (err) => {
      const errKey = getMessageKeyFromError(err);
      setError("name", { type: "server", message: errKey });
    },
  });

  const onSubmit = async (data: CreateGroupFormType) => {
    const uploadedPath = await uploadImage();

    // check upload error
    if (selectedImage && !uploadedPath) return;

    if (uploadedPath) {
      setValue("imageUrl", uploadedPath);
      data.imageUrl = uploadedPath;
    }

    const promise =
      isModifyMode && groupId
        ? groupAction.mutateAsync({
            mode: "modify",
            data: { ...data, groupId },
          })
        : groupAction.mutateAsync({
            mode: "create",
            data,
          });

    toast.promise(promise, {
      loading: {
        title: isModifyMode
          ? t("modify.toast.loading")
          : t("create.toast.loading"),
      },
      success: {
        title: isModifyMode
          ? t("modify.toast.success")
          : t("create.toast.success"),
      },
      error: (err: MutationOrQuerryError<typeof groupAction>) => {
        const errKey = getMessageKeyFromError(err, {
          generalErrorKey: isModifyMode
            ? "pages.GroupsPage.AddModifyGroupModal.modify.toast.errorDefault"
            : "pages.GroupsPage.AddModifyGroupModal.create.toast.errorDefault",
        });
        return { title: tValidation(errKey) };
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isModifyMode ? t("modify.header") : t("create.header")}
        </ModalHeader>
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

              <FileUploader
                genericFileType="image"
                onChange={handleImageChange}
                isUploadError={isUploadError}
                text={{
                  label: t("form.image.label"),
                  additionalLabel: t("form.image.additionalLabel"),
                  placeholder: t("form.image.placeholder"),
                  errorUpload: t("form.image.errorUpload"),
                }}
              />

              <FormMainButton
                text={
                  isModifyMode
                    ? t("modify.submitButton")
                    : t("create.submitButton")
                }
                type="submit"
                onElementProps={{
                  isLoading: isUploading || groupAction.isPending,
                }}
              />
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
