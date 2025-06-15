import { useTranslations } from "next-intl";
import { UserSchemaProvider } from "../../model/user-schema";
import z from "zod";

export function LoginFormSchemaProvider() {
  const t = useTranslations("Auth.LoginPage.form");
  const { emailSchema, nicknameSchema } = UserSchemaProvider();

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

export type LoginFormSchema = z.infer<
  ReturnType<typeof LoginFormSchemaProvider>["loginFormSchema"]
>;
