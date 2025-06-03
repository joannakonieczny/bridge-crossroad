"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import DefaultInput from "../inputs/DefaultInput";
import SelectInput from "../inputs/SelectInput";
import { Stack } from "@chakra-ui/react";
import { KrakowAcademy, minYear } from "@/schemas/onboarding";

function generateYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = currentYear; year >= minYear; year--) {
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

export default function FirstPage() {
  const t = useTranslations("OnboardingPage.firstPage");
  const tc = useTranslations("OnboardingPage.common");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    alert("Form submitted");
    console.log("Form submitted", event);
  }

  function handlePrevButtonClick() {
    alert("Previous button clicked");
  }

  function handleNextButtonClick() {
    alert("Next button clicked");
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
      onFormProps={{ onSubmit: handleSubmit }}
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
        <DefaultInput placeholder={t("nickName.placeholder")} />
        <SelectInput
          placeholder={t("university.placeholder")}
          options={generateUniversityOptions()}
        />
        <SelectInput
          placeholder={t("yearOfBirth.placeholder")}
          options={generateYearOptions()}
        />
      </Stack>
    </PagesLayout>
  );
}
