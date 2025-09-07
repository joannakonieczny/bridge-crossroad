"use client";

import { useMemo } from "react";
import PagesLayout from "./PagesLayout";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import { Stack, useToast } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingFormData } from "../FormDataContext";
import { useFormNavigation } from "../FormNavigationHook";
import InviteCodeInput from "../inputs/InviteCodeInput";
import CheckBoxInput from "../inputs/CheckBoxInput";
import { useFormSkippingValidation } from "../FormSkippingValidationHook";
import { completeOnboardingAndJoinMainGroup } from "@/services/onboarding/api";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  OnboardingFinalPageType,
  OnboardingFirstPageType,
  OnboardingSecondPageType,
  OnboardingThirdPageType,
} from "@/schemas/pages/onboarding/onboarding-types";
import { onboardingFinalPageSchema } from "@/schemas/pages/onboarding/onboarding-schema";
import { ROUTES } from "@/routes";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";

export default function FinalPage() {
  useFormSkippingValidation({ currentPage: "final" });
  const t = useTranslations("pages.OnboardingPage.finalPage");
  const tValidation = useTranslationsWithFallback();
  const formNavigation = useFormNavigation({
    nextPage: ROUTES.dashboard, // after onboarding is completed, redirect to dashboard
    prevPage: ROUTES.onboarding.step_3,
  });
  const onboardingContext = useOnboardingFormData();
  const finalPageData = onboardingContext.formData.finalPage;

  const defaultValues = useMemo(
    () => ({
      inviteCode: finalPageData?.inviteCode || "",
      termsAccepted: finalPageData?.termsAccepted || false,
    }),
    [finalPageData]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OnboardingFinalPageType>({
    resolver: zodResolver(onboardingFinalPageSchema),
    defaultValues: defaultValues,
  });

  const termsAccepted = watch("termsAccepted");
  const toast = useToast();

  const completeOnboardingMutation = useActionMutation({
    action: completeOnboardingAndJoinMainGroup,
    onSuccess: () => {
      formNavigation.handleNextClickedRedirectNow();
    },
  });

  function onSubmit(data: OnboardingFinalPageType) {
    onboardingContext.setData({
      page: "final",
      data: data,
    });
    const formToSend = onboardingContext.formData;
    formToSend.finalPage = data; //issue with async setter of usestate
    const typedForm = formToSend as {
      // we have all data right now //TODO handle it better -> method in context?
      firstPage: OnboardingFirstPageType;
      secondPage: OnboardingSecondPageType;
      thirdPage: OnboardingThirdPageType;
      finalPage: OnboardingFinalPageType;
    };

    const promise = completeOnboardingMutation.mutateAsync({
      academy: typedForm.firstPage.academy,
      yearOfBirth: typedForm.firstPage.yearOfBirth,
      startPlayingDate: typedForm.secondPage.startPlayingDate,
      trainingGroup: typedForm.secondPage.trainingGroup,
      hasRefereeLicense: typedForm.secondPage.hasRefereeLicense,
      cezarId: typedForm.thirdPage.cezarId,
      bboId: typedForm.thirdPage.bboId,
      cuebidsId: typedForm.thirdPage.cuebidsId,
    });
    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: { title: t("toast.error") },
    });
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
        disabled: !termsAccepted, // disabled if terms are not accepted
        text: t("submitButton"),
      }}
    >
      <Stack spacing={4} width="100%" maxWidth="md" align="center">
        <Controller
          name="inviteCode"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InviteCodeInput
              isInvalid={!!errors.inviteCode}
              errorMessage={tValidation(errors.inviteCode?.message)}
              length={8}
              onPinInputProps={{
                value: value,
                onChange: (val) => onChange(val.toUpperCase()),
                isInvalid: !!errors.inviteCode,
              }}
            />
          )}
        />

        <Controller
          name="termsAccepted"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CheckBoxInput
              label={t("terms.acceptPrefix")}
              linkInfo={{
                text: t("terms.link"),
                href: "/terms",
              }}
              isChecked={value}
              onChange={onChange}
              isInvalid={!!errors.termsAccepted}
              errorMessage={tValidation(errors.termsAccepted?.message)}
            />
          )}
        />
      </Stack>
    </PagesLayout>
  );
}
