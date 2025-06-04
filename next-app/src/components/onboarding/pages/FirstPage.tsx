"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import DefaultInput from "../inputs/DefaultInput";
import SelectInput from "../inputs/SelectInput";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { KrakowAcademy, userSchema } from "@/schemas/user";

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
  nickname: string;
  university: string;
  yearOfBirth: string;
}

export default function FirstPage() {
  const t = useTranslations("OnboardingPage.firstPage");
  const tc = useTranslations("OnboardingPage.common");
  const [submitSource, setSubmitSource] = React.useState<
    "prev" | "next" | null
  >(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nickname: "",
      university: "",
      yearOfBirth: "",
    },
  });

  const onSubmit = (data: FormData) => {
    alert("Form submitted successfully: " + JSON.stringify(data));
    if (submitSource === "next") {
      alert("Przechodzimy do następnej strony");
    } else if (submitSource === "prev") {
      alert("Wracamy do poprzedniej strony");
    }
    setSubmitSource(null);
  };

  function handlePrevButtonClick() {
    setSubmitSource("prev");
  }

  function handleNextButtonClick() {
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
        text: tc("prevButton"),
        onClick: handlePrevButtonClick,
      }}
      nextButton={{
        text: tc("nextButton"),
        onClick: handleNextButtonClick,
      }}
    >
      <Stack spacing={4} width="100%" maxWidth="md" align="center">
        <Controller
          name="nickname"
          control={control}
          rules={{
            required: "Nick jest wymagany",
            minLength: {
              value: userSchema.nicknameSchema.minLength,
              message: `Nick musi mieć minimum ${userSchema.nicknameSchema.minLength} znaki`,
            },
            maxLength: {
              value: userSchema.nicknameSchema.maxLength,
              message: `Nick może mieć maksymalnie ${userSchema.nicknameSchema.maxLength} znaków`,
            },
            pattern: {
              value: userSchema.nicknameSchema.regex,
              message:
                "Nick może zawierać tylko litery, cyfry, myślnik i podkreślenie",
            },
          }}
          render={({ field }) => (
            <DefaultInput
              placeholder={t("nickName.placeholder")}
              isRequired
              isInvalid={!!errors.nickname}
              errorMessage={errors.nickname?.message}
              onInputProps={{
                ...field,
              }}
            />
          )}
        />

        <Controller
          name="university"
          control={control}
          rules={{ required: "Wybierz uczelnię" }}
          render={({ field }) => (
            <SelectInput
              placeholder={t("university.placeholder")}
              isRequired
              isInvalid={!!errors.university}
              errorMessage={errors.university?.message}
              options={generateUniversityOptions()}
              onSelectProps={{
                ...field,
              }}
            />
          )}
        />

        <Controller
          name="yearOfBirth"
          control={control}
          rules={{ required: "Podaj rok urodzenia" }}
          render={({ field }) => (
            <SelectInput
              placeholder={t("yearOfBirth.placeholder")}
              isRequired
              isInvalid={!!errors.yearOfBirth}
              errorMessage={errors.yearOfBirth?.message}
              options={generateYearOptions()}
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
