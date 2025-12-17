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
import { resetPassword } from "@/services/auth/api";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import type {
  ActionInput,
  MutationOrQuerryError,
} from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";

export default function ForgotPasswordForm() {
  const t = useTranslations("pages.Auth.ForgotPasswordPage");
  const tValidation = useTranslationsWithFallback();
  const {
    handleSubmit: handleFormSubmit,
    control: formControl,
    setError: setFormError,
    getValues,
  } = useForm({
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

  const resetPasswordAction = useActionMutation({
    action: resetPassword,
    onSuccess: () => {
      setEmailSent(true);
      setCountdown(30);
    },
    onError: (err) => {
      const hasValidationErrors = Boolean(err?.validationErrors);
      if (hasValidationErrors) {
        setFormError("email", {
          type: "server",
          message: err?.validationErrors?.email?._errors?.[0],
        });
      }
    },
  });

  function handleWithToast(data: ActionInput<typeof resetPassword>) {
    const promise = resetPasswordAction.mutateAsync(data);
    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof resetPasswordAction>) => {
        const errKey = getMessageKeyFromError(err);
        return { title: tValidation(errKey) };
      },
    });
  }

  function handleResendEmail() {
    const email = getValues("email");
    const promise = resetPasswordAction.mutateAsync({ email });

    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.resendSuccess") },
      error: (err: MutationOrQuerryError<typeof resetPasswordAction>) => {
        const errKey = getMessageKeyFromError(err);
        return { title: tValidation(errKey) };
      },
    });

    setCountdown(30);
  }

  return (
    <FormLayout>
      <form onSubmit={handleFormSubmit(handleWithToast)}>
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
