"use client";

import { HStack, Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import FormLayout from "../FormLayout";
import { useTranslations } from "next-intl";
import ChakraLink from "@/components/chakra-config/ChakraLink";
import FormHeading from "../FormHeading";
import FormInput from "../FormInput";
import { userSchema } from "@/schemas/user";
import GoogleButton from "../FormGoogleButton";
import FormMainButton from "../FormMainButton";
import FormCheckbox from "../FormCheckbox";
import { login, LoginFormValues } from "@/services/auth/actions";

export default function LoginForm() {
  const t = useTranslations("Auth.LoginPage");
  const { handleSubmit, control } = useForm<LoginFormValues>();

  return (
    <FormLayout>
      <form onSubmit={handleSubmit(login)}>
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
            defaultValue=""
            rules={{
              required: t("form.nicknameOrEmailField.errorMessage"),
              validate: (value: string) => {
                if (value.includes("@")) {
                  // as email
                  return (
                    userSchema.emailSchema.regex.test(value) ||
                    t("form.nicknameOrEmailField.emailField.errorMessage")
                  );
                } else {
                  // as nickname
                  if (value.length < userSchema.nicknameSchema.minLength) {
                    return t(
                      "form.nicknameOrEmailField.nicknameField.minLength",
                      {
                        minLength: userSchema.nicknameSchema.minLength,
                      }
                    );
                  }
                  if (value.length > userSchema.nicknameSchema.maxLength) {
                    return t(
                      "form.nicknameOrEmailField.nicknameField.maxLength",
                      {
                        maxLength: userSchema.nicknameSchema.maxLength,
                      }
                    );
                  }
                  if (!userSchema.nicknameSchema.regex.test(value)) {
                    return t(
                      "form.nicknameOrEmailField.nicknameField.invalidSyntax"
                    );
                  }
                  return true;
                }
              },
            }}
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
            defaultValue=""
            rules={{
              required: t("form.passwordField.errorMessage"),
            }}
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
              defaultValue={true}
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
