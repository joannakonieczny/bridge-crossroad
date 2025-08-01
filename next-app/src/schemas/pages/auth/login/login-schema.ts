import { z } from "zod";
import { emailSchema, nicknameSchema } from "../../../model/user/user-schema";
import type { ValidNamespaces } from "@/lib/typed-translations";

const nicknameOrEmailSchema = z
  .string()
  .nonempty(
    "validation.pages.auth.login.nicknameOrEmail.required" as ValidNamespaces
  )
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

const passwordSchema = z
  .string()
  .nonempty("validation.pages.auth.login.password.required" as ValidNamespaces);

export const loginFormSchema = z.object({
  nicknameOrEmail: nicknameOrEmailSchema,
  password: passwordSchema,
  rememberMe: z.boolean(),
});

export { nicknameOrEmailSchema, passwordSchema };
