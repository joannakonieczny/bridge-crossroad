"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import { Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import {
  FirstPage as FirstPageType,
  SecondPage as SecondPageType,
  ThirdPage as ThirdPageType,
  FinalPage as FinalPageType,
  useOnboardingFormData,
} from "../FormDataContext";
import { useFormNavigation } from "../FormNavigationHook";
import { userSchema } from "@/schemas/user";
import InviteCodeInput from "../inputs/InviteCodeInput";
import CheckBoxInput from "../inputs/CheckBoxInput";
import { useFormSkippingValidation } from "../FormSkippingValidationHook";
import { completeOnboarding } from "@/services/onboarding/actions";

interface FormData {
  inviteCode: string;
  termsAccepted: boolean;
}

export default function FinalPage() {
  useFormSkippingValidation({ currentPage: "final" });
  const t = useTranslations("OnboardingPage.finalPage");
  const formNavigation = useFormNavigation({
    nextPage: "/dashboard", // after onboarding is completed, redirect to dashboard
    prevPage: "/onboarding/3",
  });
  const onboardingContext = useOnboardingFormData();
  const finalPageData = onboardingContext.formData.finalPage;
  const defaultValues = React.useMemo(
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
  } = useForm<FormData>({
    defaultValues: defaultValues,
  });
  const termsAccepted = watch("termsAccepted");

  function onSubmit(data: FormData) {
    onboardingContext.setData({
      page: "final",
      data: data,
    });
    const formToSend = onboardingContext.formData;
    formToSend.finalPage = data; //issue with async setter of usestate
    const typedForm = formToSend as {
      // we have all data right now //TODO handle it better -> method in context?
      firstPage: FirstPageType;
      secondPage: SecondPageType;
      thirdPage: ThirdPageType;
      finalPage: FinalPageType;
    };
    completeOnboarding({
      academy: typedForm.firstPage.university,
      yearOfBirth: typedForm.firstPage.yearOfBirth,
      startPlayingDate: typedForm.secondPage.startPlayingDate,
      trainingGroup: typedForm.secondPage.trainingGroup,
      hasRefereeLicence: typedForm.secondPage.hasRefereeLicence,
      cezarId: typedForm.thirdPage.cezarId,
      bboId: typedForm.thirdPage.bboId,
      cuebidsId: typedForm.thirdPage.cuebidsId,
      },
      data.inviteCode
    )
      .then((d) => {
        alert("Subbmitted successfully!" + JSON.stringify(d));
        formNavigation.handleNextClickedRedirectNow();
      })
      .catch((e) => {
        alert("Error while submitting: " + e.message);
        console.error("Error while submitting onboarding data:", e);
      });
    // alert(JSON.stringify(onboardingContext.formData));
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
          rules={{
            required: t("inviteCode.noneSelected"),
            pattern: {
              value: userSchema.inviteCodeSchema.regex,
              message: t("inviteCode.errorMessage"),
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InviteCodeInput
              isInvalid={!!errors.inviteCode}
              errorMessage={errors.inviteCode?.message}
              length={userSchema.inviteCodeSchema.length}
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
          rules={{
            required: t("terms.errorMessage"),
          }}
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
