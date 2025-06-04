"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import SelectInput from "../inputs/SelectInput";
import { Stack, Checkbox, FormControl } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useOnboardingFormData } from "../FormDataContext";
import MonthYearInput from "../inputs/MonthYearInput";
import { TrainingGroup } from "@/schemas/user";

function generateSkillLevelOptions() {
  return Object.entries(TrainingGroup).map(([key, value]) => ({
    value: key,
    label: value,
  }));
}

interface FormData {
  monthYear: string; // format: "MM-YYYY"
  skillLevel: string; // key of TrainingGroup enum
  hasRefereeLicence: boolean;
}

type SubmitSourceType = "prev" | "next" | null;

// Komponent wyboru miesiąca i roku

export default function SecondPage() {
  const t = useTranslations("OnboardingPage.secondPage");
  const [submitSource, setSubmitSource] =
    React.useState<SubmitSourceType>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const onboardingContext = useOnboardingFormData();
  const skillLevelOptions = React.useMemo(
    () => generateSkillLevelOptions(),
    []
  );

  function onSubmit(data: FormData) {
    onboardingContext.setData({
      page: 2,
      data: {
        startPlayingDate: data.monthYear,
        trainingGroup: data.skillLevel as TrainingGroup,
        hasRefereeLicence: data.hasRefereeLicence,
      },
    });

    switch (submitSource) {
      case "next":
        router.push("/onboarding/3");
        break;
      case "prev":
        router.push("/onboarding/1");
        break;
    }
    setSubmitSource(null);
  }

  function handlePrevButtonClicked() {
    setSubmitSource("prev");
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
        onClick: handlePrevButtonClicked,
      }}
      nextButton={{
        onClick: handleNextButtonClicked,
      }}
    >
      <Stack spacing={4} width="100%" maxWidth="md" align="center">
        <FormControl isInvalid={!!errors.monthYear}>
          <Controller
            name="monthYear"
            defaultValue=""
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
          defaultValue=""
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
          name="hasRefereeLicence"
          defaultValue={false}
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControl>
              <Checkbox
                colorScheme="accent"
                isChecked={value}
                onChange={(e) => onChange(e.target.checked)}
              >
                {t("hasRefereeLicence.label")}
              </Checkbox>
            </FormControl>
          )}
        />
      </Stack>
    </PagesLayout>
  );
}
