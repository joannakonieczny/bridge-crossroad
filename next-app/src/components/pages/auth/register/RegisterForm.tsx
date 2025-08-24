"use client";

import { HStack, Stack, useToast } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import FormLayout from "../FormLayout";
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";
import FormHeading from "../FormHeading";
import FormInput from "../FormInput";
import GoogleButton from "../FormGoogleButton";
import FormMainButton from "../FormMainButton";
import FormCheckbox from "../FormCheckbox";
import { register } from "@/services/auth/api";
import { registerFormSchema } from "@/schemas/pages/auth/register/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import type {
  ActionInput,
  MutationOrQuerryError,
} from "@/lib/tanstack-action/types";
import { getMessageKeyFromError } from "@/lib/tanstack-action/helpers";
import { ROUTES } from "@/routes";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const t = useTranslations("pages.Auth.RegisterPage");
  const tValidation = useTranslationsWithFallback();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nickname: "",
      email: "",
      password: "",
      repeatPassword: "",
      rememberMe: true,
    },
  });

  const toast = useToast();
  const router = useRouter();

  const registerAction = useActionMutation({
    action: register,
    onSuccess: () => {
      router.push(ROUTES.dashboard);
    },
  });

  function handleWithToast(data: ActionInput<typeof register>) {
    const promise = registerAction.mutateAsync(data);
    toast.promise(promise, {
      loading: { title: t("toast.loading") },
      success: { title: t("toast.success") },
      error: (err: MutationOrQuerryError<typeof registerAction>) => {
        const errKey = getMessageKeyFromError(err);
        return { title: tValidation(errKey) };
      },
    });
  }

  return (
    <FormLayout>
      <form onSubmit={handleSubmit(handleWithToast)}>
        <Stack spacing={3} mt={8}>
          <FormHeading
            title={t("title")}
            href={ROUTES.auth.login}
            AccountText={t("hasAccount.text")}
            AccountLink={t("hasAccount.link")}
          />
          <HStack>
            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState: { error } }) => (
                <FormInput
                  placeholder={t("form.firstNameField.placeholder")}
                  errorMessage={tValidation(error?.message)}
                  isInvalid={!!error}
                  id="firstName"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field, fieldState: { error } }) => (
                <FormInput
                  placeholder={t("form.lastNameField.placeholder")}
                  errorMessage={tValidation(error?.message)}
                  isInvalid={!!error}
                  id="lastName"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </HStack>

          <Controller
            control={control}
            name="nickname"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.nicknameField.placeholder")}
                errorMessage={tValidation(error?.message)}
                isInvalid={!!error}
                id="nickname"
                type="text"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.emailField.placeholder")}
                errorMessage={tValidation(error?.message)}
                isInvalid={!!error}
                id="email"
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

          <Controller
            control={control}
            name="repeatPassword"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.repeatPasswordField.placeholder")}
                errorMessage={tValidation(error?.message)}
                isInvalid={!!error}
                id="repeatPassword"
                type="password"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

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

          <Stack spacing={3}>
            <GoogleButton text={t("submitButtons.registerWithGoogle")} />
            <FormMainButton text={t("submitButtons.register")} type="submit" />
          </Stack>
        </Stack>
      </form>
    </FormLayout>
  );
}
