"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import SelectInput from "../inputs/SelectInput";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { KrakowAcademy, userSchema } from "@/schemas/user";
import { useOnboardingFormData } from "../FormDataContext";
import { useFormNavigation } from "../FormNavigationHook";
import { useFormSkippingValidation } from "../FormSkippingValidationHook";

function generateYearOptions() {
  const years = [];
  for (
    let year = userSchema.yearOfBirthSchema.max;
    year >= userSchema.yearOfBirthSchema.min;
    year--
  ) {
    years.push({
      value: year.toString(),
      label: year.toString(),
    });
  }

  return years;
}

function generateUniversityOptions() {
  return Object.entries(KrakowAcademy).map(([key, value]) => ({
    value: key,
    label: value,
  }));
}

interface FormData {
  university: string;
  yearOfBirth: string;
}

export default function FirstPage() {
  useFormSkippingValidation({ currentPage: "1" });
  const t = useTranslations("OnboardingPage.firstPage");
  const formNavigation = useFormNavigation({ nextPage: "/onboarding/2" });
  const onboardingContext = useOnboardingFormData();
  const firstPageData = onboardingContext.formData.firstPage;
  const defaultValues = React.useMemo(
    () => ({
      university: firstPageData?.university || "",
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
  } = useForm<FormData>({
    defaultValues: defaultValues,
  });

  const universityOptions = React.useMemo(
    () => generateUniversityOptions(),
    []
  );
  const yearOptions = React.useMemo(() => generateYearOptions(), []);

  function onSubmit(data: FormData) {
    onboardingContext.setData({
      page: "1",
      data: {
        university: data.university as KrakowAcademy,
        yearOfBirth: parseInt(data.yearOfBirth, 10),
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
        disabled: true, // no prev page
      }}
      nextButton={{
        onClick: formNavigation.handleNextClicked,
      }}
    >
      <Stack spacing={4} width="100%" maxWidth="md" align="center">
        <Controller
          name="university"
          control={control} // usunięto defaultValue, bo jest już w useForm
          rules={{ required: t("university.noneSelected") }}
          render={({ field }) => (
            <SelectInput
              placeholder={t("university.placeholder")}
              isInvalid={!!errors.university}
              errorMessage={errors.university?.message}
              options={universityOptions}
              onSelectProps={{
                ...field,
              }}
            />
          )}
        />
        <Controller
          name="yearOfBirth"
          control={control} // usunięto defaultValue, bo jest już w useForm
          rules={{ required: t("yearOfBirth.noneSelected") }}
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
