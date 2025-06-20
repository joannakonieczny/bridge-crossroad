"use client";

import { HStack, Stack, useToast } from "@chakra-ui/react";
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
import { LoginFormSchemaProvider } from "@/schemas/pages/auth/login/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";

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
  const toast = useToast();

  const loginAction = useAction(login, {
    onError: (e) => {
      const errorMessages = e.error.validationErrors?._errors;
      console.log("Login error:", JSON.stringify(errorMessages));
      // alert("Login error:" + JSON.stringify(errorMessages));
      if (errorMessages && errorMessages.length > 0) {
        toast({
          title: errorMessages[0],
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <FormLayout>
      <form onSubmit={handleSubmit((data) => loginAction.executeAsync(data))}>
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
