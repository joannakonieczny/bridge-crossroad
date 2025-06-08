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
import { register, RegisterFormValues } from "@/services/auth/actions";

export default function RegisterForm() {
  const t = useTranslations("Auth.RegisterPage");
  const { handleSubmit, control, watch } = useForm<RegisterFormValues>();

  const passwordValue = watch("password");

  return (
    <FormLayout>
      <form onSubmit={handleSubmit(register)}>
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
              defaultValue=""
              rules={{
                required: t("form.firstNameField.errorMessage"),
                minLength: {
                  value: userSchema.firstNameSchema.minLength,
                  message: t("form.firstNameField.minLength", {
                    minLength: userSchema.firstNameSchema.minLength,
                  }),
                },
                maxLength: {
                  value: userSchema.firstNameSchema.maxLength,
                  message: t("form.firstNameField.maxLength", {
                    maxLength: userSchema.firstNameSchema.maxLength,
                  }),
                },
                validate: (value: string) =>
                  userSchema.firstNameSchema.regex.test(value) ||
                  t("form.firstNameField.invalidSyntax"),
              }}
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
              defaultValue=""
              rules={{
                required: t("form.lastNameField.errorMessage"),
                minLength: {
                  value: userSchema.lastNameSchema.minLength,
                  message: t("form.lastNameField.minLength", {
                    minLength: userSchema.lastNameSchema.minLength,
                  }),
                },
                maxLength: {
                  value: userSchema.lastNameSchema.maxLength,
                  message: t("form.lastNameField.maxLength", {
                    maxLength: userSchema.lastNameSchema.maxLength,
                  }),
                },
                validate: (value: string) =>
                  userSchema.lastNameSchema.regex.test(value) ||
                  t("form.lastNameField.invalidSyntax"),
              }}
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
            rules={{
              minLength: {
                value: userSchema.nicknameSchema.minLength,
                message: t("form.nicknameField.minLength", {
                  minLength: userSchema.nicknameSchema.minLength,
                }),
              },
              maxLength: {
                value: userSchema.nicknameSchema.maxLength,
                message: t("form.nicknameField.maxLength", {
                  maxLength: userSchema.nicknameSchema.maxLength,
                }),
              },
              validate: (value: string | undefined) => {
                if (!value) {
                  return true; //optional field
                }
                return (
                  userSchema.nicknameSchema.regex.test(value) ||
                  t("form.nicknameField.invalidSyntax")
                );
              },
            }}
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
