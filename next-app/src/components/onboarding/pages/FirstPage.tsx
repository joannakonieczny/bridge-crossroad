"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import SelectInput from "../inputs/SelectInput";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingFormData } from "../FormDataContext";
import { useFormNavigation } from "../FormNavigationHook";
import { useFormSkippingValidation } from "../FormSkippingValidationHook";
import { Academy } from "@/club-preset/academy";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OnboardingFirstPageSchema,
  OnboardingFirstPageSchemaProvider,
} from "@/schemas/pages/onboarding/first-page-schema";
import { UserValidationConstants } from "@/schemas/model/user/user-const";

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
  const t = useTranslations("OnboardingPage.firstPage");
  const tAcademy = useTranslations("common.academy");
  const formNavigation = useFormNavigation({ nextPage: "/onboarding/2" });
  const onboardingContext = useOnboardingFormData();
  const firstPageData = onboardingContext.formData.firstPage;

  const { formSchema } = OnboardingFirstPageSchemaProvider();

  const defaultValues = React.useMemo(
    () => ({
      academy: firstPageData?.academy || "",
      yearOfBirth: firstPageData?.yearOfBirth
        ? firstPageData.yearOfBirth.toString()
        : "",
    }),
    [firstPageData]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const academyOptions = React.useMemo(
    () =>
      Object.values(Academy).map((value) => ({
        value,
        label: tAcademy(value),
      })),
    [tAcademy]
  );
  const yearOptions = React.useMemo(() => generateYearOptions(), []);

  function onSubmit(data: OnboardingFirstPageSchema) {
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
          render={({ field }) => (
            <SelectInput
              placeholder={t("academy.placeholder")}
              isInvalid={!!errors.academy}
              errorMessage={errors.academy?.message}
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
          render={({ field }) => (
            <SelectInput
              placeholder={t("yearOfBirth.placeholder")}
              isInvalid={!!errors.yearOfBirth}
              errorMessage={errors.yearOfBirth?.message}
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
