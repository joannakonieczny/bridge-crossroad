import { z } from "zod";
import {
  emailSchema,
  nicknameSchema,
  firstNameSchema,
  lastNameSchema,
} from "../../../model/user/user-schema";
import { UserValidationConstants } from "@/schemas/model/user/user-const";
import type { TKey } from "@/lib/typed-translations";

const { password } = UserValidationConstants;

const passwordSchema = z
  .string({
    message: "validation.pages.auth.register.password.required" satisfies TKey,
  })
  .nonempty("validation.pages.auth.register.password.required" satisfies TKey)
  .min(
    password.min,
    "validation.pages.auth.register.password.min" satisfies TKey
  )
  .max(
    password.max,
    "validation.pages.auth.register.password.max" satisfies TKey
  )
  .regex(
    password.noUpperCaseRegex,
    "validation.pages.auth.register.password.noUpperCase" satisfies TKey
  )
  .regex(
    password.noLowerCaseRegex,
    "validation.pages.auth.register.password.noLowerCase" satisfies TKey
  )
  .regex(
    password.noDigitRegex,
    "validation.pages.auth.register.password.noDigit" satisfies TKey
  )
  .regex(
    password.noSpecialCharRegex,
    "validation.pages.auth.register.password.noSpecialChar" satisfies TKey
  );

const repeatPasswordSchema = z
  .string({
    message:
      "validation.pages.auth.register.repeatPassword.required" satisfies TKey,
  })
  .nonempty(
    "validation.pages.auth.register.repeatPassword.required" satisfies TKey
  );

export const registerFormSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    nickname: nicknameSchema.optional(),
    email: emailSchema,
    password: passwordSchema,
    repeatPassword: repeatPasswordSchema,
  })
  .transform((data) => {
    const result = { ...data };
    if (result.nickname === undefined) {
      delete result.nickname;
    }
    return result;
  })
  .refine((data) => data.password === data.repeatPassword, {
    message:
      "validation.pages.auth.register.repeatPassword.mismatch" satisfies TKey,
    path: ["repeatPassword"],
  });

export { passwordSchema, repeatPasswordSchema };
