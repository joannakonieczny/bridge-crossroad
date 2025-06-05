"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import DefaultInput from "../inputs/DefaultInput";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingFormData } from "../FormDataContext";
import { casualString } from "@/schemas/user";
import { useFormNavigation } from "../FormNavigationHook";

interface FormData {
  cezarId?: string;
  bboId?: string;
  cuebidsId?: string;
}

export default function ThirdPage() {
  const t = useTranslations("OnboardingPage.thirdPage");
  const formNavigation = useFormNavigation({
    nextPage: "/onboarding/final",
    prevPage: "/onboarding/2",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onboardingContext = useOnboardingFormData();

  function onSubmit(data: FormData) {
    onboardingContext.setData({
      page: "3",
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
        onClick: formNavigation.handlePrevClickedRedirectNow,
      }}
      nextButton={{
        onClick: formNavigation.handleNextClicked,
      }}
    >
      <Stack spacing={4} width="100%" maxWidth="md" align="center">
        <Controller
          name="cezarId"
          control={control}
          defaultValue=""
          rules={{
            maxLength: {
              value: casualString.maxLength,
              message: t("cezarId.maxLenght", {
                maxLength: casualString.maxLength,
              }),
            },
          }}
          render={({ field }) => (
            <DefaultInput
              placeholder={t("cezarId.placeholder")}
              isInvalid={!!errors.cezarId}
              errorMessage={errors.cezarId?.message}
              onInputProps={{
                ...field,
              }}
            />
          )}
        />

        <Controller
          name="bboId"
          control={control}
          defaultValue=""
          rules={{
            maxLength: {
              value: casualString.maxLength,
              message: t("bboId.maxLenght", {
                maxLength: casualString.maxLength,
              }),
            },
          }}
          render={({ field }) => (
            <DefaultInput
              placeholder={t("bboId.placeholder")}
              isInvalid={!!errors.bboId}
              errorMessage={errors.bboId?.message}
              onInputProps={{
                ...field,
              }}
            />
          )}
        />

        <Controller
          name="cuebidsId"
          control={control}
          defaultValue=""
          rules={{
            maxLength: {
              value: casualString.maxLength,
              message: t("cuebidsId.maxLenght", {
                maxLength: casualString.maxLength,
              }),
            },
          }}
          render={({ field }) => (
            <DefaultInput
              placeholder={t("cuebidsId.placeholder")}
              isInvalid={!!errors.cuebidsId}
              errorMessage={errors.cuebidsId?.message}
              onInputProps={{
                ...field,
              }}
            />
          )}
        />
      </Stack>
    </PagesLayout>
  );
}
