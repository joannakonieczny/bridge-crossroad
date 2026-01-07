import { z } from "zod";
import { emailSchema, nicknameSchema } from "../../../model/user/user-schema";
import { isProbablyEmail } from "@/schemas/common";
import type { TKey } from "@/lib/typed-translations";

const nicknameOrEmailSchema = z
  .string({
    message:
      "validation.pages.auth.login.nicknameOrEmail.required" satisfies TKey,
  })
  .nonempty(
    "validation.pages.auth.login.nicknameOrEmail.required" satisfies TKey
  )
  .superRefine((value, ctx) => {
    if (isProbablyEmail(value)) {
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
  .string({
    message: "validation.pages.auth.login.password.required" satisfies TKey,
  })
  .nonempty("validation.pages.auth.login.password.required" satisfies TKey);

export const loginFormSchema = z.object({
  nicknameOrEmail: nicknameOrEmailSchema,
  password: passwordSchema,
});

export { nicknameOrEmailSchema, passwordSchema };
