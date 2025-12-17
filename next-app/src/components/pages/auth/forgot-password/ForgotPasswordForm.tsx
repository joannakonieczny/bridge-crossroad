"use client";

import { Stack, useToast, Text, Button } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import FormLayout from "@/components/pages/auth/FormLayout";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import FormHeading from "@/components/pages/auth/FormHeading";
import FormInput from "@/components/common/form/FormInput";
import FormMainButton from "@/components/common/form/FormMainButton";
import { forgotPasswordFormSchema } from "@/schemas/pages/auth/forgot-password/forgot-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/routes";
import { withEmptyToUndefined } from "@/schemas/common";

export default function ForgotPasswordForm() {
  const t = useTranslations("pages.Auth.ForgotPasswordPage");
  const tValidation = useTranslationsWithFallback();
  const { handleSubmit: handleFormSubmit, control: formControl } = useForm({
    resolver: zodResolver(withEmptyToUndefined(forgotPasswordFormSchema)),
    defaultValues: {
      email: "",
    },
  });
  const toast = useToast();
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  function handleSubmit(data: { email: string }) {
    // TODO: Zaimplementuj logikę wysyłania emaila resetującego hasło
    console.log("Wysyłanie emaila do:", data.email);

    toast({
      title: t("toast.success"),
      status: "success",
      duration: 5000,
    });

    setEmailSent(true);
    setCountdown(30);
  }

  function handleResendEmail() {
    // TODO: Zaimplementuj logikę ponownego wysyłania emaila
    console.log("Ponowne wysyłanie emaila");

    toast({
      title: t("toast.resendSuccess"),
      status: "success",
      duration: 5000,
    });

    setCountdown(30);
  }

  return (
    <FormLayout>
      <form onSubmit={handleFormSubmit(handleSubmit)}>
        <Stack spacing={4} mt={8}>
          <FormHeading
            title={t("title")}
            href={ROUTES.auth.login}
            AccountText={t("backToLogin.text")}
            AccountLink={t("backToLogin.link")}
          />

          {!emailSent ? (
            <>
              <Controller
                control={formControl}
                name="email"
                render={({ field, fieldState: { error } }) => (
                  <FormInput
                    placeholder={t("form.emailField.placeholder")}
                    errorMessage={
                      typeof error?.message === "string"
                        ? tValidation(error.message)
                        : undefined
                    }
                    isInvalid={!!error}
                    id="email"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Stack spacing={3} pt={4}>
                <FormMainButton
                  text={t("submitButtons.sendEmail")}
                  type="submit"
                />
              </Stack>
            </>
          ) : (
            <>
              <Stack spacing={4} py={4}>
                <Text fontSize="md" textAlign="center" color="gray.700">
                  {t("emailSentInfo.message")}
                </Text>
                <Text fontSize="sm" textAlign="center" color="gray.600">
                  {t("emailSentInfo.instructions")}
                </Text>
              </Stack>

              <Stack spacing={3} pt={4}>
                <Button
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  onClick={handleResendEmail}
                  isDisabled={countdown > 0}
                >
                  {countdown > 0
                    ? `${t("submitButtons.resendEmail")} (${countdown}s)`
                    : t("submitButtons.resendEmail")}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </form>
    </FormLayout>
  );
}
