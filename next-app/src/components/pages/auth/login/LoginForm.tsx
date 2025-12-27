"use client";

import { HStack, Stack, useToast } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import FormLayout from "@/components/pages/auth/FormLayout";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import ChakraLink from "@/components/chakra-config/ChakraLink";
import FormHeading from "@/components/pages/auth/FormHeading";
import FormInput from "@/components/common/form/FormInput";
import FormMainButton from "@/components/common/form/FormMainButton";
import { login } from "@/services/auth/api";
import { loginFormSchema } from "@/schemas/pages/auth/login/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { ROUTES } from "@/routes";
import type {
  ActionInput,
  MutationOrQuerryError,
} from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import { useRouter } from "next/navigation";
import { withEmptyToUndefined } from "@/schemas/common";

export default function LoginForm() {
  const t = useTranslations("pages.Auth.LoginPage");
  const tValidation = useTranslationsWithFallback();
  const {
    handleSubmit: handleFormSubmit,
    control: formControl,
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(withEmptyToUndefined(loginFormSchema)),
    defaultValues: {
      nicknameOrEmail: "",
      password: "",
    },
  });
  const toast = useToast();
  const router = useRouter();

  const loginAction = useActionMutation({
    action: login,
    onSuccess: () => {
      router.push(ROUTES.dashboard);
    },
    onError: (err) => {
      const hasValidationErrors = Boolean(err?.validationErrors);
      if (hasValidationErrors) {
        setFormError("nicknameOrEmail", { type: "server", message: undefined });
        setFormError("password", { type: "server", message: undefined });
      }
    },
  });

  function handleWithToast(data: ActionInput<typeof login>) {
    const promise = loginAction.mutateAsync(data);
    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof loginAction>) => {
        const errKey = getMessageKeyFromError(err);
        return { title: tValidation(errKey) };
      },
    });
  }

  return (
    <FormLayout>
      <form onSubmit={handleFormSubmit(handleWithToast)}>
        <Stack spacing={4} mt={8}>
          <FormHeading
            title={t("title")}
            href={ROUTES.auth.register}
            AccountText={t("noAccount.text")}
            AccountLink={t("noAccount.link")}
          />

          <Controller
            control={formControl}
            name="nicknameOrEmail"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.nicknameOrEmailField.placeholder")}
                errorMessage={
                  typeof error?.message === "string"
                    ? tValidation(error.message)
                    : undefined
                }
                isInvalid={!!error}
                id="nicknameOrEmail"
                type="text"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={formControl}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.passwordField.placeholder")}
                errorMessage={
                  typeof error?.message === "string"
                    ? tValidation(error.message)
                    : undefined
                }
                isInvalid={!!error}
                id="password"
                type="password"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <HStack justify="flex-end">
            <ChakraLink color="accent.500" href={ROUTES.auth.forgot_password}>
              {t("utilities.forgotPassword")}
            </ChakraLink>
          </HStack>

          <Stack spacing={3}>
            <FormMainButton text={t("submitButtons.login")} type="submit" />
          </Stack>
        </Stack>
      </form>
    </FormLayout>
  );
}
