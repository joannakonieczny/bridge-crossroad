"use client";

import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";
import { Stack, Checkbox, FormControl, Text, Link } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingFormData } from "../FormDataContext";
import { useFormNavigation } from "../FormNavigationHook";
import { userSchema } from "@/schemas/user";
import InviteCodeInput from "../inputs/InviteCodeInput";

interface FormData {
  inviteCode: string;
  termsAccepted: boolean;
}

export default function FinalPage() {
  const t = useTranslations("OnboardingPage.finalPage");
  const formNavigation = useFormNavigation({
    nextPage: "/dashboard", // strona po zakończeniu onboardingu
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
    alert(JSON.stringify(onboardingContext.formData));
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
        disabled: !termsAccepted, // disabled if terms are not accepted
        text: t("submitButton"),
      }}
    >
      <Stack spacing={4} width="100%" maxWidth="md" align="center">
        <Controller
          name="inviteCode"
          control={control}
          rules={{
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
            <FormControl isInvalid={!!errors.termsAccepted}>
              <Checkbox
                colorScheme="accent"
                isChecked={value}
                onChange={(e) => onChange(e.target.checked)}
                isRequired
              >
                <Text fontSize="sm">
                  {t("terms.acceptPrefix")}{" "}
                  <Link
                    href="/terms"
                    isExternal
                    color="accent.500"
                    textDecoration="underline"
                  >
                    {t("terms.link")}
                  </Link>
                </Text>
              </Checkbox>
              {errors.termsAccepted && (
                <Text color="red.500" fontSize="xs" mt={1}>
                  {errors.termsAccepted.message}
                </Text>
              )}
            </FormControl>
          )}
        />
      </Stack>
    </PagesLayout>
  );
}
