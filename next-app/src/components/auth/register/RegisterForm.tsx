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
import { userSchema } from "@/schemas/user";

type FormValues = {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
  rememberMe: boolean;
};

export default function RegisterForm() {
  const t = useTranslations("Auth.RegisterPage");
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data));
  };

  const passwordValue = watch("password");

  return (
    <FormLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              name="name"
              defaultValue=""
              rules={{
                required: t("form.nameField.errorMessage"),
                minLength: {
                  value: userSchema.nameSchema.minLength,
                  message: t("form.nameField.minLength", {
                    minLength: userSchema.nameSchema.minLength,
                  }),
                },
                maxLength: {
                  value: userSchema.nameSchema.maxLength,
                  message: t("form.nameField.maxLength", {
                    maxLength: userSchema.nameSchema.maxLength,
                  }),
                },
                validate: (value: string) =>
                  userSchema.nameSchema.regex.test(value) ||
                  t("form.nameField.invalidNameSyntax"),
              }}
              render={({ field, fieldState: { error } }) => (
                <FormInput
                  placeholder={t("form.nameField.placeholder")}
                  errorMessage={
                    error?.message ?? t("form.nameField.errorMessage")
                  }
                  isInvalid={!!error}
                  id="name"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="surname"
              defaultValue=""
              rules={{
                required: t("form.surnameField.errorMessage"),
                minLength: {
                  value: userSchema.surnameSchema.minLength,
                  message: t("form.surnameField.minLength", {
                    minLength: userSchema.surnameSchema.minLength,
                  }),
                },
                maxLength: {
                  value: userSchema.surnameSchema.maxLength,
                  message: t("form.surnameField.maxLength", {
                    maxLength: userSchema.surnameSchema.maxLength,
                  }),
                },
                validate: (value: string) =>
                  userSchema.surnameSchema.regex.test(value) ||
                  t("form.surnameField.invalidSurnameSyntax"),
              }}
              render={({ field, fieldState: { error } }) => (
                <FormInput
                  placeholder={t("form.surnameField.placeholder")}
                  errorMessage={
                    error?.message ?? t("form.surnameField.errorMessage")
                  }
                  isInvalid={!!error}
                  id="surname"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </HStack>

          <Controller
            control={control}
            name="email"
            defaultValue=""
            rules={{
              required: t("form.emailField.errorMessage"),
              pattern: {
                value: userSchema.emailSchema.regex,
                message: t("form.emailField.errorMessage"),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <FormInput
                placeholder={t("form.emailField.placeholder")}
                errorMessage={
                  error?.message ?? t("form.emailField.errorMessage")
                }
                isInvalid={!!error}
                id="email"
                type="email"
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
              validate: (value: string) => {
                if (!userSchema.passwordSchema.upperCaseRegex.test(value)) {
                  return t("form.passwordField.noUpperCase");
                }
                if (!userSchema.passwordSchema.lowerCaseRegex.test(value)) {
                  return t("form.passwordField.noLowerCase");
                }
                if (!userSchema.passwordSchema.digitRegex.test(value)) {
                  return t("form.passwordField.noDigit");
                }
                if (!userSchema.passwordSchema.specialCharRegex.test(value)) {
                  return t("form.passwordField.noSpecialChar");
                }
                if (value.length < userSchema.passwordSchema.minLength) {
                  return t("form.passwordField.minLength", {
                    minLength: userSchema.passwordSchema.minLength,
                  });
                }
                if (value.length > userSchema.passwordSchema.maxLength) {
                  return t("form.passwordField.maxLength", {
                    maxLength: userSchema.passwordSchema.maxLength,
                  });
                }
                return true;
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

          <Controller
            control={control}
            name="repeatPassword"
            defaultValue=""
            rules={{
              required: t("form.repeatPasswordField.errorMessage"),
              validate: (value: string) =>
                value === passwordValue ||
                t("form.repeatPasswordField.errorMessage"),
            }}
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

          <Stack spacing={3}>
            <GoogleButton text={t("submitButtons.registerWithGoogle")} />
            <FormMainButton text={t("submitButtons.register")} type="submit" />
          </Stack>
        </Stack>
      </form>
    </FormLayout>
  );
}
