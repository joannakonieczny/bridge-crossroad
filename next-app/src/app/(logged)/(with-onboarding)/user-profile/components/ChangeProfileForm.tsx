"use client";

import React from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import FormInput from "@/components/common/form/FormInput";
import FormMainButton from "@/components/common/form/FormMainButton";
import { changeProfileSchema } from "@/schemas/pages/with-onboarding/user/user-change-schema";
import { changeProfile } from "@/services/user/api";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries";
import type { z } from "zod";
import { withEmptyToUndefined } from "@/schemas/common";

type ChangeProfileFormData = z.infer<typeof changeProfileSchema>;

type ChangeProfileFormProps = {
  user: {
    name: {
      firstName: string;
      lastName: string;
    };
    nickname?: string;
  };
};

export function ChangeProfileForm({ user }: ChangeProfileFormProps) {
  const toast = useToast();
  const t = useTranslations("pages.UserProfilePage.ChangeProfileForm");
  const tValidation = useTranslationsWithFallback();
  const queryClient = useQueryClient();

  const { handleSubmit, control, setError, reset } = useForm({
    resolver: zodResolver(withEmptyToUndefined(changeProfileSchema)),
    defaultValues: {
      firstName: user.name.firstName,
      lastName: user.name.lastName,
      nickname: user.nickname || "",
    },
  });

  const { mutateAsync, isPending } = useActionMutation({
    action: changeProfile,
    onError: (error) => {
      const errors = error?.validationErrors;
      if (errors) {
        (Object.keys(errors) as (keyof ChangeProfileFormData)[]).forEach(
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
      if (!toast.isActive("change-profile-error")) {
        toast({
          id: "change-profile-error",
          status: "error",
          title: tValidation(messageKey),
        });
      }
    },
  });

  const onSubmit = async (data: ChangeProfileFormData) => {
    const toastId = "change-profile-toast";

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

      reset(data);
    } catch {
      toast.close(toastId);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="text"
              placeholder={t("form.firstName.placeholder")}
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="text"
              placeholder={t("form.lastName.placeholder")}
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="nickname"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="text"
              placeholder={t("form.nickname.placeholder")}
              value={field.value || ""}
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
