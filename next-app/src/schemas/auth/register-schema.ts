import { useTranslations } from "next-intl";
import { UserNameSchemaProvider, UserSchemaProvider } from "../user";
import { z } from "zod";
import { emptyStringToUndefined } from "../common";

export function RegisterFormSchemaProvider() {
  const t = useTranslations("Auth.RegisterPage.form");
  const { emailSchema, nicknameSchema } = UserSchemaProvider();
  const { firstNameSchema, lastNameSchema } = UserNameSchemaProvider();

  const passwordSchema = z
    .string()
    .nonempty(t("passwordField.required"))
    .min(6, t("passwordField.minLength", { minLength: 6 }))
    .max(16, t("passwordField.maxLength", { maxLength: 16 }))
    .regex(/(?=.*[A-Z])/, t("passwordField.noUpperCase"))
    .regex(/(?=.*[a-z])/, t("passwordField.noLowerCase"))
    .regex(/(?=.*\d)/, t("passwordField.noDigit"))
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, t("passwordField.noSpecialChar"));

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
