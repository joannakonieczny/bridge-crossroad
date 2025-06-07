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
import { useRouter } from "next//navigation";

export default function LoginForm() {
  const router = useRouter();
  const t = useTranslations("Auth.LoginPage");
  const { handleSubmit, control } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    const result = await login(data);
    if (result.success) {
      router.push('/dashboard');
    } else {
      alert(result.error || 'Błąd logowania');
    }
  };

  return (
    <FormLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} mt={8}>
          <FormHeading
            title={t("title")}
            href="/auth/register"
            AccountText={t("noAccount.text")}
            AccountLink={t("noAccount.link")}
          />

          <Controller
            control={control}
            name="loginOrEmail"
            defaultValue=""
            rules={{
              required: t("form.loginOrEmailField.errorMessage"),
              validate: (value: string) => {
                if (value.includes("@")) {
                  // as email
                  return (
                    userSchema.emailSchema.regex.test(value) ||
                    t("form.loginOrEmailField.invalidEmail")
                  );
                } else {
                  // as login
                  if (value.length < userSchema.loginSchema.minLength) {
                    return t("form.loginOrEmailField.minLengthLogin", {
                      minLength: userSchema.loginSchema.minLength,
                    });
                  }
                  if (value.length > userSchema.loginSchema.maxLength) {
                    return t("form.loginOrEmailField.maxLengthLogin", {
                      maxLength: userSchema.loginSchema.maxLength,
                    });
                  }
                  if (!userSchema.loginSchema.regex.test(value)) {
                    return t("form.loginOrEmailField.invalidLoginSyntax");
                  }
                  return true;
                }
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.loginOrEmailField.placeholder")}
                errorMessage={
                  error?.message ?? t("form.loginOrEmailField.errorMessage")
                }
                isInvalid={!!error}
                id="loginOrEmail"
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
              minLength: {
                value: userSchema.passwordSchema.minLength,
                message: t("form.passwordField.minLength", {
                  minLength: userSchema.passwordSchema.minLength,
                }),
              },
              maxLength: {
                value: userSchema.passwordSchema.maxLength,
                message: t("form.passwordField.maxLength", {
                  maxLength: userSchema.passwordSchema.maxLength,
                }),
              },
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
