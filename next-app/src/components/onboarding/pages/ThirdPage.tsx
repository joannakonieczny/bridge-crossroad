"use client";

import { useMemo } from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import DefaultInput from "../inputs/DefaultInput";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingFormData } from "../FormDataContext";
import { useFormNavigation } from "../FormNavigationHook";
import { useFormSkippingValidation } from "../FormSkippingValidationHook";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OnboardingThirdPageSchema,
  OnboardingThirdPageSchemaProvider,
} from "@/schemas/pages/onboarding/third-page-schema";

export default function ThirdPage() {
  useFormSkippingValidation({ currentPage: "3" });
  const t = useTranslations("OnboardingPage.thirdPage");
  const formNavigation = useFormNavigation({
    nextPage: "/onboarding/final",
    prevPage: "/onboarding/2",
  });
  const onboardingContext = useOnboardingFormData();
  const thirdPageData = onboardingContext.formData.thirdPage;

  const { formSchema } = OnboardingThirdPageSchemaProvider();

  const defaultValues = useMemo(
    () => ({
      cezarId: thirdPageData?.cezarId || "",
      bboId: thirdPageData?.bboId || "",
      cuebidsId: thirdPageData?.cuebidsId || "",
    }),
    [thirdPageData]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(data: OnboardingThirdPageSchema) {
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
