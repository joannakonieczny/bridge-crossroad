"use client";

import { useMemo } from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "@/lib/typed-translations";
import SelectInput from "../inputs/SelectInput";
import { Stack, Checkbox, FormControl } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingFormData } from "../FormDataContext";
import MonthYearInput from "../inputs/MonthYearInput";
import { useFormNavigation } from "../FormNavigationHook";
import { useFormSkippingValidation } from "../FormSkippingValidationHook";
import { TrainingGroup } from "@/club-preset/training-group";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OnboardingSecondPageSchema,
  OnboardingSecondPageSchemaProvider,
} from "@/schemas/pages/onboarding/second-page-schema";
import { ROUTES } from "@/routes";

export default function SecondPage() {
  useFormSkippingValidation({ currentPage: "2" });
  const t = useTranslations("OnboardingPage.secondPage");
  const tTrainingGroup = useTranslations("common.trainingGroup");
  const formNavigation = useFormNavigation({
    nextPage: ROUTES.onboarding.step_3,
    prevPage: ROUTES.onboarding.step_1,
  });
  const onboardingContext = useOnboardingFormData();
  const secondPageData = onboardingContext.formData.secondPage;

  const { formSchema } = OnboardingSecondPageSchemaProvider();

  const defaultValues = useMemo(
    () => ({
      startPlayingDate: secondPageData?.startPlayingDate || "",
      trainingGroup: secondPageData?.trainingGroup || "",
      hasRefereeLicense: secondPageData?.hasRefereeLicense || false,
    }),
    [secondPageData]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const trainingGroupOptions = useMemo(
    () =>
      Object.values(TrainingGroup).map((value) => ({
        value,
        label: tTrainingGroup(value),
      })),
    [tTrainingGroup]
  );

  function onSubmit(data: OnboardingSecondPageSchema) {
    onboardingContext.setData({
      page: "2",
      data: {
        startPlayingDate: data.startPlayingDate,
        trainingGroup: data.trainingGroup as TrainingGroup,
        hasRefereeLicense: data.hasRefereeLicense,
      },
    });
    formNavigation.handleNavigation();
  }

  return (
    <PagesLayout
      mainHeading={{
        text: t("mainHeading.text"),
        highlight: {
          query: t("mainHeading.highlight"),
        },
      }}
      subHeading={{ text: t("subHeading") }}
      onFormProps={{ onSubmit: handleSubmit(onSubmit) }}
      prevButton={{
        onClick: formNavigation.handlePrevClickedRedirectNow,
      }}
      nextButton={{
        onClick: formNavigation.handleNextClicked,
      }}
    >
      <Stack spacing={4} width="100%" maxWidth="md" align="center">
        <FormControl isInvalid={!!errors.startPlayingDate}>
          <Controller
            name="startPlayingDate"
            control={control}
            render={({ field }) => (
              <MonthYearInput
                value={field.value}
                onChange={field.onChange}
                placeholder={t("startPlayingDate.placeholder")}
                errorMessage={errors.startPlayingDate?.message}
                isInvalid={!!errors.startPlayingDate}
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
          render={({ field }) => (
            <SelectInput
              placeholder={t("skillLevel.placeholder")}
              isInvalid={!!errors.trainingGroup}
              errorMessage={errors.trainingGroup?.message}
              options={trainingGroupOptions}
              onSelectProps={{
                ...field,
              }}
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
                {t("hasRefereeLicense.label")}
              </Checkbox>
            </FormControl>
          )}
        />
      </Stack>
    </PagesLayout>
  );
}
