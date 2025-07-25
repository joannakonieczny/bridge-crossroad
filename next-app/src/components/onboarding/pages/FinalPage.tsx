"use client";

import { useMemo } from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingFormData } from "../FormDataContext";
import { useFormNavigation } from "../FormNavigationHook";
import InviteCodeInput from "../inputs/InviteCodeInput";
import CheckBoxInput from "../inputs/CheckBoxInput";
import { useFormSkippingValidation } from "../FormSkippingValidationHook";
import { completeOnboarding } from "@/services/onboarding/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OnboardingFinalPageSchema,
  OnboardingFinalPageSchemaProvider,
} from "@/schemas/pages/onboarding/final-page-schema";
import { OnboardingFirstPageSchema } from "@/schemas/pages/onboarding/first-page-schema";
import { OnboardingSecondPageSchema } from "@/schemas/pages/onboarding/second-page-schema";
import { OnboardingThirdPageSchema } from "@/schemas/pages/onboarding/third-page-schema";
import { ROUTES } from "@/routes";

export default function FinalPage() {
  useFormSkippingValidation({ currentPage: "final" });
  const t = useTranslations("OnboardingPage.finalPage");
  const formNavigation = useFormNavigation({
    nextPage: ROUTES.dashboard, // after onboarding is completed, redirect to dashboard
    prevPage: ROUTES.onboarding.step_3,
  });
  const onboardingContext = useOnboardingFormData();
  const finalPageData = onboardingContext.formData.finalPage;

  // Pobieramy schemat formularza
  const { formSchema } = OnboardingFinalPageSchemaProvider();

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
  } = useForm<OnboardingFinalPageSchema>({
    resolver: zodResolver(formSchema), // Używamy zodResolver z naszym schematem
    defaultValues: defaultValues,
  });
  const termsAccepted = watch("termsAccepted");

  function onSubmit(data: OnboardingFinalPageSchema) {
    onboardingContext.setData({
      page: "final",
      data: data,
    });
    const formToSend = onboardingContext.formData;
    formToSend.finalPage = data; //issue with async setter of usestate
    const typedForm = formToSend as {
      // we have all data right now //TODO handle it better -> method in context?
      firstPage: OnboardingFirstPageSchema;
      secondPage: OnboardingSecondPageSchema;
      thirdPage: OnboardingThirdPageSchema;
      finalPage: OnboardingFinalPageSchema;
    };
    // alert("Submitting data: " + JSON.stringify(typedForm));
    completeOnboarding({
      academy: typedForm.firstPage.academy,
      yearOfBirth: typedForm.firstPage.yearOfBirth,
      startPlayingDate: typedForm.secondPage.startPlayingDate,
      trainingGroup: typedForm.secondPage.trainingGroup,
      hasRefereeLicense: typedForm.secondPage.hasRefereeLicense,
      cezarId: typedForm.thirdPage.cezarId,
      bboId: typedForm.thirdPage.bboId,
      cuebidsId: typedForm.thirdPage.cuebidsId,
    })
      .then((d) => {
        alert("Subbmitted successfully!" + JSON.stringify(d));
        formNavigation.handleNextClickedRedirectNow();
      })
      .catch((e) => {
        alert("Error while submitting: " + e.message);
        console.error("Error while submitting onboarding data:", e);
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
              errorMessage={errors.inviteCode?.message}
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
              errorMessage={errors.termsAccepted?.message}
            />
          )}
        />
      </Stack>
    </PagesLayout>
  );
}
