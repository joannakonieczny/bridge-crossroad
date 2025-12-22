"use client";

import React from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import FormInput from "@/components/common/form/FormInput";
import FormMainButton from "@/components/common/form/FormMainButton";
import { changePasswordSchema } from "@/schemas/pages/with-onboarding/user/user-change-schema";
import { changePassword } from "@/services/user/api";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import type { z } from "zod";
import { withEmptyToUndefined } from "@/schemas/common";

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const toast = useToast();
  const t = useTranslations("pages.UserProfilePage.ChangePasswordForm");
  const tValidation = useTranslationsWithFallback();

  const { handleSubmit, control, setError, reset } = useForm({
    resolver: zodResolver(withEmptyToUndefined(changePasswordSchema)),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    },
  });

  const { mutateAsync, isPending } = useActionMutation({
    action: changePassword,
    onError: (error) => {
      const errors = error?.validationErrors;
      if (errors) {
        (Object.keys(errors) as (keyof ChangePasswordFormData)[]).forEach(
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
      if (!toast.isActive("change-password-error")) {
        toast({
          id: "change-password-error",
          status: "error",
          title: tValidation(messageKey),
        });
      }
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const toastId = "change-password-toast";

    toast({
      id: toastId,
      status: "loading",
      title: t("toast.loading"),
      duration: null,
    });

    try {
      await mutateAsync(data);

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
        <Controller
          name="oldPassword"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="password"
              placeholder={t("form.oldPassword.placeholder")}
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="newPassword"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="password"
              placeholder={t("form.newPassword.placeholder")}
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="repeatNewPassword"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="password"
              placeholder={t("form.repeatNewPassword.placeholder")}
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
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
