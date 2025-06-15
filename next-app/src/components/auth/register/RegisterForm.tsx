"use client";

import { HStack, Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import FormLayout from "../FormLayout";
import { useTranslations } from "next-intl";
import FormHeading from "../FormHeading";
import FormInput from "../FormInput";
import GoogleButton from "../FormGoogleButton";
import FormMainButton from "../FormMainButton";
import FormCheckbox from "../FormCheckbox";
import { register } from "@/services/auth/actions";
import { RegisterFormSchemaProvider } from "@/schemas/pages/auth/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
  const t = useTranslations("Auth.RegisterPage");
  const { registerFormSchema } = RegisterFormSchemaProvider();
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

  return (
    <FormLayout>
      <form onSubmit={handleSubmit((data) => register(data))}>
        <Stack spacing={3} mt={8}>
          <FormHeading
            title={t("title")}
            href="/auth/login"
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
                  errorMessage={
                    error?.message ?? t("form.firstNameField.errorMessage")
                  }
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
                  errorMessage={
                    error?.message ?? t("form.lastNameField.errorMessage")
                  }
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
                errorMessage={
                  error?.message ?? t("form.nicknameField.errorMessage")
                }
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
                errorMessage={
                  error?.message ?? t("form.emailField.errorMessage")
                }
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
                errorMessage={
                  error?.message ?? t("form.passwordField.errorMessage")
                }
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
                errorMessage={
                  error?.message ?? t("form.repeatPasswordField.errorMessage")
                }
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
