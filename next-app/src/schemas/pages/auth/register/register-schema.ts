import { useTranslations } from "next-intl";
import {
  UserNameSchemaProvider,
  UserNameSchemaProviderServer,
  UserSchemaProvider,
  UserSchemaProviderServer,
  Z_EmailSchema,
  Z_FirstNameSchema,
  Z_LastNameSchema,
  Z_NicknameSchema,
} from "../../../model/user/user-schema";
import { UserValidationConstants } from "@/schemas/model/user/user-const";
import { z } from "zod";
import { emptyStringToUndefined, TranslationFunction } from "../../../common";
import { getTranslations } from "next-intl/server";

const translationKey = "Auth.RegisterPage.form";

function _RegisterFormSchemaProvider(
  t: TranslationFunction,
  emailSchema: Z_EmailSchema,
  nicknameSchema: Z_NicknameSchema,
  firstNameSchema: Z_FirstNameSchema,
  lastNameSchema: Z_LastNameSchema
) {
  const { password } = UserValidationConstants;

  const passwordSchema = z
    .string()
    .nonempty(t("passwordField.required"))
    .min(
      password.min,
      t("passwordField.minLength", { minLength: password.min })
    )
    .max(
      password.max,
      t("passwordField.maxLength", { maxLength: password.max })
    )
    .regex(password.noUpperCaseRegex, t("passwordField.noUpperCase"))
    .regex(password.noLowerCaseRegex, t("passwordField.noLowerCase"))
    .regex(password.noDigitRegex, t("passwordField.noDigit"))
    .regex(password.noSpecialCharRegex, t("passwordField.noSpecialChar"));

  const repeatPasswordSchema = z
    .string()
    .nonempty(t("repeatPasswordField.errorMessage"));

  const registerFormSchema = z
    .object({
      firstName: firstNameSchema,
      lastName: lastNameSchema,
      nickname: z
        .string()
        .transform(emptyStringToUndefined)
        .pipe(nicknameSchema.optional())
        .optional(),
      email: emailSchema,
      password: passwordSchema,
      repeatPassword: repeatPasswordSchema,
      rememberMe: z.boolean(),
    })
    .transform((data) => {
      const result = { ...data };
      if (result.nickname === undefined) {
        delete result.nickname;
      }
      return result;
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: t("repeatPasswordField.errorMessage"),
      path: ["repeatPassword"],
    });

  return {
    registerFormSchema,
    repeatPasswordSchema,
    passwordSchema,
  };
}

export type Z_RegisterFormSchema = ReturnType<
  typeof RegisterFormSchemaProvider
>["registerFormSchema"];

export type Z_RepeatPasswordSchema = ReturnType<
  typeof RegisterFormSchemaProvider
>["repeatPasswordSchema"];

export type Z_PasswordSchema = ReturnType<
  typeof RegisterFormSchemaProvider
>["passwordSchema"];

export async function RegisterFormSchemaProviderServer() {
  //for server use
  const translation = await getTranslations(translationKey);
  const { emailSchema, nicknameSchema } = await UserSchemaProviderServer();
  const { firstNameSchema, lastNameSchema } =
    await UserNameSchemaProviderServer();
  return _RegisterFormSchemaProvider(
    translation,
    emailSchema,
    nicknameSchema,
    firstNameSchema,
    lastNameSchema
  );
}

export function RegisterFormSchemaProvider() {
  //for client use
  const translation = useTranslations(translationKey);
  const { emailSchema, nicknameSchema } = UserSchemaProvider();
  const { firstNameSchema, lastNameSchema } = UserNameSchemaProvider();
  return _RegisterFormSchemaProvider(
    translation,
    emailSchema,
    nicknameSchema,
    firstNameSchema,
    lastNameSchema
  );
}
