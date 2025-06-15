"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import SelectInput from "../inputs/SelectInput";
import { Stack, Checkbox, FormControl } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingFormData } from "../FormDataContext";
import MonthYearInput from "../inputs/MonthYearInput";
import { useFormNavigation } from "../FormNavigationHook";
import { useFormSkippingValidation } from "../FormSkippingValidationHook";
import { TrainingGroup } from "@/club-preset/training-group";

interface FormData {
  monthYear: string; // format: "MM-YYYY" //TODO change to date
  skillLevel: string; // key of TrainingGroup enum
  hasRefereeLicense: boolean;
}

export default function SecondPage() {
  useFormSkippingValidation({ currentPage: "2" });
  const t = useTranslations("OnboardingPage.secondPage");
  const tTrainingGroup = useTranslations("common.trainingGroup");
  const formNavigation = useFormNavigation({
    nextPage: "/onboarding/3",
    prevPage: "/onboarding/1",
  });
  const onboardingContext = useOnboardingFormData();
  const secondPageData = onboardingContext.formData.secondPage;
  const defaultValues = React.useMemo(
    () => ({
      monthYear: secondPageData?.startPlayingDate || "",
      skillLevel: secondPageData?.trainingGroup || "",
      hasRefereeLicense: secondPageData?.hasRefereeLicense || false,
    }),
    [secondPageData]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: defaultValues,
  });

  const skillLevelOptions = React.useMemo(
    () =>
      Object.values(TrainingGroup).map((value) => ({
        value,
        label: tTrainingGroup(value.toLowerCase()),
      })),
    [tTrainingGroup]
  );

  function onSubmit(data: FormData) {
    onboardingContext.setData({
      page: "2",
      data: {
        startPlayingDate: data.monthYear,
        trainingGroup: data.skillLevel as TrainingGroup,
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
        <FormControl isInvalid={!!errors.monthYear}>
          <Controller
            name="monthYear"
            control={control}
            rules={{ required: t("monthYear.noneSelected") }}
            render={({ field }) => (
              <MonthYearInput
                value={field.value}
                onChange={field.onChange}
                placeholder={t("monthYear.placeholder")}
                errorMessage={errors.monthYear?.message}
                isInvalid={!!errors.monthYear}
                onElementProps={{
                  ...field,
                }}
              />
            )}
          />
        </FormControl>

        <Controller
          name="skillLevel"
          control={control}
          rules={{ required: t("skillLevel.noneSelected") }}
          render={({ field }) => (
            <SelectInput
              placeholder={t("skillLevel.placeholder")}
              isInvalid={!!errors.skillLevel}
              errorMessage={errors.skillLevel?.message}
              options={skillLevelOptions}
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
