import { useTranslations } from "next-intl";
import {
  UserNameSchemaProvider,
  UserSchemaProvider,
  UserValidationConstants,
} from "../../model/user-schema";
import { z } from "zod";
import { emptyStringToUndefined } from "../../common";

export function RegisterFormSchemaProvider() {
  const t = useTranslations("Auth.RegisterPage.form");
  const { emailSchema, nicknameSchema } = UserSchemaProvider();
  const { firstNameSchema, lastNameSchema } = UserNameSchemaProvider();
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
        .pipe(nicknameSchema),
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
  };
}

export type RegisterFormSchema = z.infer<
  ReturnType<typeof RegisterFormSchemaProvider>["registerFormSchema"]
>;
