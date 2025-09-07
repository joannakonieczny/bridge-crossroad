"use client";

import { useMemo } from "react";
import PagesLayout from "./PagesLayout";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import SelectInput from "../inputs/SelectInput";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingFormData } from "../FormDataContext";
import { useFormNavigation } from "../FormNavigationHook";
import { useFormSkippingValidation } from "../FormSkippingValidationHook";
import { Academy } from "@/club-preset/academy";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidationConstants } from "@/schemas/model/user/user-const";
import { ROUTES } from "@/routes";
import { onboardingFirstPageSchema } from "@/schemas/pages/onboarding/onboarding-schema";
import type { OnboardingFirstPageType } from "@/schemas/pages/onboarding/onboarding-types";

function generateYearOptions() {
  const years = [];
  for (
    let year = UserValidationConstants.yearOfBirth.max;
    year >= UserValidationConstants.yearOfBirth.min;
    year--
  ) {
    years.push({
      value: year.toString(),
      label: year.toString(),
    });
  }

  return years;
}

export default function FirstPage() {
  useFormSkippingValidation({ currentPage: "1" });
  const t = useTranslations("pages.OnboardingPage.firstPage");
  const tAcademy = useTranslations("common.academy");
  const tValidation = useTranslationsWithFallback();
  const formNavigation = useFormNavigation({
    nextPage: ROUTES.onboarding.step_2,
  });
  const onboardingContext = useOnboardingFormData();
  const firstPageData = onboardingContext.formData.firstPage;

  const defaultValues = useMemo(
    () => ({
      academy: firstPageData?.academy || "",
      yearOfBirth: firstPageData?.yearOfBirth
        ? firstPageData.yearOfBirth.toString()
        : "",
    }),
    [firstPageData]
  );

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(onboardingFirstPageSchema),
    defaultValues: defaultValues,
  });

  const academyOptions = useMemo(
    () =>
      Object.values(Academy).map((value) => ({
        value,
        label: tAcademy(value),
      })),
    [tAcademy]
  );
  const yearOptions = useMemo(() => generateYearOptions(), []);

  function onSubmit(data: OnboardingFirstPageType) {
    onboardingContext.setData({
      page: "1",
      data: data,
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
        disabled: true, // no prev page
      }}
      nextButton={{
        onClick: formNavigation.handleNextClicked,
      }}
    >
      <Stack spacing={4} width="100%" maxWidth="md" align="center">
        <Controller
          name="academy"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <SelectInput
              placeholder={t("academy.placeholder")}
              isInvalid={!!error}
              errorMessage={tValidation(error?.message)}
              options={academyOptions}
              onSelectProps={{
                ...field,
              }}
            />
          )}
        />
        <Controller
          name="yearOfBirth"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <SelectInput
              placeholder={t("yearOfBirth.placeholder")}
              isInvalid={!!error}
              errorMessage={tValidation(error?.message)}
              options={yearOptions}
              onSelectProps={{
                ...field,
              }}
            />
          )}
        />
      </Stack>
    </PagesLayout>
  );
}
