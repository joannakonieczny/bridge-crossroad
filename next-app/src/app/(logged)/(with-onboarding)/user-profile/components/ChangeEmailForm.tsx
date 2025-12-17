"use client";

import React from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import FormInput from "@/components/common/form/FormInput";
import FormMainButton from "@/components/common/form/FormMainButton";
import { changeEmailSchema } from "@/schemas/pages/with-onboarding/user/user-change-schema";
import { changeEmail } from "@/services/user/api";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries";
import type { z } from "zod";

type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

type ChangeEmailFormProps = {
  currentEmail: string;
};

export function ChangeEmailForm({ currentEmail }: ChangeEmailFormProps) {
  const toast = useToast();
  const t = useTranslations("pages.UserProfilePage.ChangeEmailForm");
  const tValidation = useTranslationsWithFallback();
  const queryClient = useQueryClient();

  const { handleSubmit, control, setError, reset } =
    useForm<ChangeEmailFormData>({
      resolver: zodResolver(changeEmailSchema),
      defaultValues: {
        newEmail: "",
      },
    });

  const { mutateAsync, isPending } = useActionMutation({
    action: changeEmail,
    onError: (error) => {
      const errors = error?.validationErrors;
      if (errors) {
        (Object.keys(errors) as (keyof ChangeEmailFormData)[]).forEach(
          (key) => {
            const fieldErrors = errors[key];
            if (fieldErrors && "_errors" in fieldErrors) {
              setError(key, {
                message: tValidation(fieldErrors._errors?.[0]),
              });
            }
          }
        );
      }

      const messageKey =
        getMessageKeyFromError(error) ?? t("toast.errorDefault");
      if (!toast.isActive("change-email-error")) {
        toast({
          id: "change-email-error",
          status: "error",
          title: tValidation(messageKey),
        });
      }
    },
  });

  const onSubmit = async (data: ChangeEmailFormData) => {
    const toastId = "change-email-toast";

    toast({
      id: toastId,
      status: "loading",
      title: t("toast.loading"),
      duration: null,
    });

    try {
      await mutateAsync(data);

      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userInfo });

      toast.update(toastId, {
        status: "success",
        title: t("toast.success"),
        duration: 3000,
      });

      reset();
    } catch {
      toast.close(toastId);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormInput
          type="email"
          placeholder={t("form.currentEmail.placeholder")}
          value={currentEmail}
          onChange={() => {}}
          inputProps={{ isReadOnly: true, opacity: 0.6, cursor: "not-allowed" }}
        />

        <Controller
          name="newEmail"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="email"
              placeholder={t("form.newEmail.placeholder")}
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <FormMainButton
          text={t("submitButton")}
          type="submit"
          onElementProps={{ isLoading: isPending }}
        />
      </Stack>
    </form>
  );
}
