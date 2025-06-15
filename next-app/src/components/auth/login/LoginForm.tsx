"use client";

import { HStack, Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import FormLayout from "../FormLayout";
import { useTranslations } from "next-intl";
import ChakraLink from "@/components/chakra-config/ChakraLink";
import FormHeading from "../FormHeading";
import FormInput from "../FormInput";
import GoogleButton from "../FormGoogleButton";
import FormMainButton from "../FormMainButton";
import FormCheckbox from "../FormCheckbox";
import { login } from "@/services/auth/actions";
import { LoginFormSchemaProvider } from "@/schemas/pages/auth/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
  const t = useTranslations("Auth.LoginPage");
  const { loginFormSchema } = LoginFormSchemaProvider();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      nicknameOrEmail: "",
      password: "",
      rememberMe: true,
    },
  });

  return (
    <FormLayout>
      <form onSubmit={handleSubmit((data) => login(data))}>
        <Stack spacing={2} mt={8}>
          <FormHeading
            title={t("title")}
            href="/auth/register"
            AccountText={t("noAccount.text")}
            AccountLink={t("noAccount.link")}
          />

          <Controller
            control={control}
            name="nicknameOrEmail"
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.nicknameOrEmailField.placeholder")}
                errorMessage={
                  error?.message ?? t("form.nicknameOrEmailField.errorMessage")
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
            <ChakraLink color="accent.500" href="/auth/forgot-password">
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
