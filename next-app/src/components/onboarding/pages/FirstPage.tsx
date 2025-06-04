"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import SelectInput from "../inputs/SelectInput";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { KrakowAcademy, userSchema } from "@/schemas/user";
import { useRouter } from "next/navigation";
import { useOnboardingFormData } from "../FormDataContext";

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

type SubmitSourceType = "prev" | "next" | null;

export default function FirstPage() {
  const t = useTranslations("OnboardingPage.firstPage");
  const [submitSource, setSubmitSource] =
    React.useState<SubmitSourceType>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const onboardingContext = useOnboardingFormData();

  const universityOptions = React.useMemo(
    () => generateUniversityOptions(),
    []
  );
  const yearOptions = React.useMemo(() => generateYearOptions(), []);

  function onSubmit(data: FormData) {
    onboardingContext.setData({
      page: 1,
      data: {
        university: data.university as KrakowAcademy,
        yearOfBirth: parseInt(data.yearOfBirth, 10),
      },
    });

    switch (submitSource) {
      case "next":
        router.push("/onboarding/2");
        break;
    }
    setSubmitSource(null);
  }

  function handleNextButtonClicked() {
    setSubmitSource("next");
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
        disabled: true, // No previous page
      }}
      nextButton={{
        onClick: handleNextButtonClicked,
      }}
    >
      <Stack spacing={4} width="100%" maxWidth="md" align="center">
        <Controller
          name="university"
          defaultValue=""
          control={control}
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
          defaultValue=""
          control={control}
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
