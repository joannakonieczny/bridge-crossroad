import { useTranslations } from "next-intl";
import {
  UserSchemaProvider,
  UserSchemaProviderServer,
  Z_EmailSchema,
  Z_NicknameSchema,
} from "../../../model/user/user-schema";
import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { TranslationFunction } from "@/schemas/common";

const translationKey = "Auth.LoginPage.form";

function _LoginFormSchemaProvider(
  t: TranslationFunction,
  emailSchema: Z_EmailSchema,
  nicknameSchema: Z_NicknameSchema
) {
  // const nicknameOrEmailSchema = z.union([emailSchema, nicknameSchema]);
  const nicknameOrEmailSchema = z
    .string()
    .nonempty(t("nicknameOrEmailField.required"))
    .superRefine((value, ctx) => {
      if (value.includes("@")) {
        const result = emailSchema.safeParse(value);
        if (!result.success) {
          result.error.errors.forEach((err) => {
            ctx.addIssue({
              code: "custom",
              message: err.message,
              path: err.path,
            });
          });
        }
      } else {
        const result = nicknameSchema.safeParse(value);
        if (!result.success) {
          result.error.errors.forEach((err) => {
            ctx.addIssue({
              code: "custom",
              message: err.message,
              path: err.path,
            });
          });
        }
      }
    });

  const passwordSchema = z.string().nonempty(t("passwordField.required"));

  const loginFormSchema = z.object({
    nicknameOrEmail: nicknameOrEmailSchema,
    password: passwordSchema,
    rememberMe: z.boolean(),
  });

  return { nicknameOrEmailSchema, passwordSchema, loginFormSchema };
}

export type Z_NicknameOrEmailSchema = ReturnType<
  typeof _LoginFormSchemaProvider
>["nicknameOrEmailSchema"];

export type Z_PasswordSchema = ReturnType<
  typeof _LoginFormSchemaProvider
>["passwordSchema"];

export type Z_LoginFormSchema = ReturnType<
  typeof _LoginFormSchemaProvider
>["loginFormSchema"];

export async function LoginFormSchemaProviderServer() {
  //for server use
  const translation = await getTranslations(translationKey);
  const { emailSchema, nicknameSchema } = await UserSchemaProviderServer();
  return _LoginFormSchemaProvider(translation, emailSchema, nicknameSchema);
}

export function LoginFormSchemaProvider() {
  //for client use
  const translation = useTranslations(translationKey);
  const { emailSchema, nicknameSchema } = UserSchemaProvider();
  return _LoginFormSchemaProvider(translation, emailSchema, nicknameSchema);
}
