"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import DefaultInput from "../inputs/DefaultInput";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useOnboardingFormData } from "../FormDataContext";
import { casualString } from "@/schemas/user";

interface FormData {
  cezarId?: string;
  bboId?: string;
  cuebidsId?: string;
}

type SubmitSourceType = "prev" | "next" | null;

export default function ThirdPage() {
  const t = useTranslations("OnboardingPage.thirdPage");
  const [submitSource, setSubmitSource] =
    React.useState<SubmitSourceType>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const onboardingContext = useOnboardingFormData();

  function onSubmit(data: FormData) {
    onboardingContext.setData({
      page: 3,
      data: {
        CezarId: data.cezarId || undefined,
        BBOId: data.bboId || undefined,
        CuebidsId: data.cuebidsId || undefined,
      },
    });

    switch (submitSource) {
      case "next":
        router.push("/onboarding/4");
        break;
      case "prev":
        router.push("/onboarding/2");
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
