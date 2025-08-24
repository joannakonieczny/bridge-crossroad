"use client";

import { HStack, Stack, useToast } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import FormLayout from "../FormLayout";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import ChakraLink from "@/components/chakra-config/ChakraLink";
import FormHeading from "../FormHeading";
import FormInput from "../FormInput";
import GoogleButton from "../FormGoogleButton";
import FormMainButton from "../FormMainButton";
import FormCheckbox from "../FormCheckbox";
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

export default function LoginForm() {
  const t = useTranslations("pages.Auth.LoginPage");
  const tValidation = useTranslationsWithFallback();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      nicknameOrEmail: "",
      password: "",
      rememberMe: true,
    },
  });
  const toast = useToast();
  const router = useRouter();

  const loginAction = useActionMutation({
    action: login,
    onSuccess: () => {
      router.push(ROUTES.dashboard);
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
      <form onSubmit={handleSubmit(handleWithToast)}>
        <Stack spacing={4} mt={8}>
          <FormHeading
            title={t("title")}
            href={ROUTES.auth.register}
            AccountText={t("noAccount.text")}
            AccountLink={t("noAccount.link")}
          />

          <Controller
            control={control}
            name="nicknameOrEmail"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.nicknameOrEmailField.placeholder")}
                errorMessage={tValidation(error?.message)}
                isInvalid={!!error}
                id="nicknameOrEmail"
                type="text"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.passwordField.placeholder")}
                errorMessage={tValidation(error?.message)}
                isInvalid={!!error}
                id="password"
                type="password"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <HStack justify="space-between" pt={4}>
            <Controller
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <FormCheckbox
                  text={t("utilities.rememberMe")}
                  onElementProps={{
                    isChecked: field.value,
                    onChange: (e) => field.onChange(e.target.checked),
                  }}
                />
              )}
            />
            <ChakraLink color="accent.500" href={ROUTES.auth.forgot_password}>
              {t("utilities.forgotPassword")}
            </ChakraLink>
          </HStack>

          <Stack spacing={3}>
            <GoogleButton text={t("submitButtons.loginWithGoogle")} />
            <FormMainButton text={t("submitButtons.login")} type="submit" />
          </Stack>
        </Stack>
      </form>
    </FormLayout>
  );
}
