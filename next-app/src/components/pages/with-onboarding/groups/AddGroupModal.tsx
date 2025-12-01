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
import FormMainButton from "@/components/common/form/FormMainButton";
import { createGroupFormSchema } from "@/schemas/pages/with-onboarding/groups/groups-schema";
import { createNewGroup } from "@/services/groups/api";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const { handleSubmit, control, setError, reset, setValue } = useForm({
    resolver: zodResolver(withEmptyToUndefined(createGroupFormSchema)),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.filePath as string;
    },
  });

  const createGroupAction = useActionMutation({
    action: createNewGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.joinedGroups });
      reset();
      setSelectedImage(null);
      onClose();
    },
    onError: (err) => {
      const errKey = getMessageKeyFromError(err);
      setError("name", { type: "server", message: errKey });
    },
  });

  const onSubmit = async (data: CreateGroupFormType) => {
    if (selectedImage) {
      const promise = uploadImageMutation.mutateAsync(selectedImage);
      toast.promise(promise, {
        loading: { title: "upload zdjecia" },
        success: { title: "udalo sie uploadowac" },
        error: { title: "nie udalo sie uploadowac" },
      });
      const uploadedPath = await promise.catch(() => undefined);

      setValue("imageUrl", uploadedPath);
      data.imageUrl = uploadedPath;
      if (!uploadedPath) return; // stop if upload failed
    }

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

              <FileUploader
                placeholder="Wybierz zdjęcie grupy"
                genericFileType="image"
                onChange={(file) => {
                  setSelectedImage(file);
                  if (!file) {
                    uploadImageMutation.reset();
                  }
                }}
                isUploadError={uploadImageMutation.isError}
              />

              <FormMainButton
                text={t("submitButton")}
                type="submit"
                onElementProps={{
                  isLoading: uploadImageMutation.isPending,
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
