"use client";

import React, { useMemo } from "react";
import { Stack, useToast, Checkbox, FormControl } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import FormInput from "@/components/common/form/FormInput";
import SelectInput from "@/components/common/form/SelectInput";
import FormMainButton from "@/components/common/form/FormMainButton";
import MonthYearInput from "@/components/pages/onboarding/inputs/MonthYearInput";
import { changeOnboardingDataSchema } from "@/schemas/pages/with-onboarding/user/user-change-schema";
import { changeOnboardingData } from "@/services/user/api";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries";
import { Academy } from "@/club-preset/academy";
import { TrainingGroup } from "@/club-preset/training-group";
import type { z } from "zod";
import { withEmptyToUndefined } from "@/schemas/common";

// Use input type (before transformation) for form data
type ChangeOnboardingDataFormData = z.input<typeof changeOnboardingDataSchema>;

// Use output type (after transformation) for the onSubmit handler
type ChangeOnboardingDataOutput = z.infer<typeof changeOnboardingDataSchema>;

type ChangeOnboardingFormProps = {
  user: {
    onboardingData?: {
      academy: string;
      yearOfBirth: number;
      startPlayingDate: Date;
      trainingGroup: string;
      hasRefereeLicense: boolean;
      cezarId?: string;
      bboId?: string;
      cuebidsId?: string;
    };
  };
};

export function ChangeOnboardingForm({ user }: ChangeOnboardingFormProps) {
  const toast = useToast();
  const t = useTranslations("pages.UserProfilePage.ChangeOnboardingForm");
  const tAcademy = useTranslations("common.academy");
  const tTrainingGroup = useTranslations("common.trainingGroup");
  const tValidation = useTranslationsWithFallback();
  const queryClient = useQueryClient();

  const academyOptions = useMemo(
    () =>
      Object.values(Academy).map((value) => ({
        value,
        label: tAcademy(value),
      })),
    [tAcademy]
  );

  const trainingGroupOptions = useMemo(
    () =>
      [
        TrainingGroup.BASIC,
        TrainingGroup.INTERMEDIATE,
        TrainingGroup.ADVANCED,
        TrainingGroup.NONE,
        TrainingGroup.COACH,
      ].map((value) => ({
        value,
        label: tTrainingGroup(value),
      })),
    [tTrainingGroup]
  );

  const formatDateToMonthYear = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const { handleSubmit, control, setError, reset } = useForm({
    resolver: zodResolver(withEmptyToUndefined(changeOnboardingDataSchema)),
    defaultValues: {
      academy: user.onboardingData?.academy || "",
      yearOfBirth: user.onboardingData?.yearOfBirth.toString() || "",
      startPlayingDate: user.onboardingData?.startPlayingDate
        ? formatDateToMonthYear(user.onboardingData.startPlayingDate)
        : "",
      trainingGroup: user.onboardingData?.trainingGroup || "",
      hasRefereeLicense: user.onboardingData?.hasRefereeLicense || false,
      cezarId: user.onboardingData?.cezarId || "",
      bboId: user.onboardingData?.bboId || "",
      cuebidsId: user.onboardingData?.cuebidsId || "",
    },
  });

  const { mutateAsync, isPending } = useActionMutation({
    action: changeOnboardingData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userInfo });
      reset();
    },
    onError: (error) => {
      const errors = error?.validationErrors;
      if (errors) {
        (Object.keys(errors) as (keyof ChangeOnboardingDataFormData)[]).forEach(
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
    },
  });

  const onSubmit = async (data: ChangeOnboardingDataOutput) => {
    // The data is in output format (Academy enum, number for year) but the API expects input format (strings)
    // We need to convert it back to the input format
    const inputData: ChangeOnboardingDataFormData = {
      academy: data.academy as string,
      yearOfBirth: data.yearOfBirth.toString(),
      startPlayingDate: data.startPlayingDate,
      trainingGroup: data.trainingGroup as string,
      hasRefereeLicense: data.hasRefereeLicense,
      cezarId: data.cezarId,
      bboId: data.bboId,
      cuebidsId: data.cuebidsId,
    };

    const promise = mutateAsync(inputData);

    toast.promise(promise, {
      loading: {
        title: t("toast.loading"),
      },
      success: {
        title: t("toast.success"),
      },
      error: (error) => {
        const messageKey = getMessageKeyFromError(error);
        return {
          title: tValidation(messageKey || t("toast.errorDefault")),
        };
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Controller
          name="academy"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              placeholder={t("form.academy.placeholder")}
              value={field.value}
              onChange={field.onChange}
              options={academyOptions}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="yearOfBirth"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="number"
              placeholder={t("form.yearOfBirth.placeholder")}
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
            />
          )}
        />

        <FormControl>
          <Controller
            name="startPlayingDate"
            control={control}
            render={({ field, fieldState }) => (
              <MonthYearInput
                value={field.value}
                onChange={field.onChange}
                placeholder={t("form.startPlayingDate.placeholder")}
                errorMessage={tValidation(fieldState.error?.message)}
                isInvalid={!!fieldState.error}
                onElementProps={{
                  ...field,
                }}
              />
            )}
          />
        </FormControl>

        <Controller
          name="trainingGroup"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              placeholder={t("form.trainingGroup.placeholder")}
              value={field.value}
              onChange={field.onChange}
              options={trainingGroupOptions}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="hasRefereeLicense"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControl>
              <Checkbox
                colorScheme="accent"
                isChecked={value}
                onChange={(e) => onChange(e.target.checked)}
              >
                {t("form.hasRefereeLicense.placeholder")}
              </Checkbox>
            </FormControl>
          )}
        />

        <Controller
          name="cezarId"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="text"
              placeholder={t("form.cezarId.placeholder")}
              value={field.value || ""}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="bboId"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="text"
              placeholder={t("form.bboId.placeholder")}
              value={field.value || ""}
              onChange={field.onChange}
              isInvalid={!!fieldState.error}
              errorMessage={tValidation(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="cuebidsId"
          control={control}
          render={({ field, fieldState }) => (
            <FormInput
              type="text"
              placeholder={t("form.cuebidsId.placeholder")}
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
