import { z } from "zod";
import {
  emailSchema,
  nicknameSchema,
  firstNameSchema,
  lastNameSchema,
} from "../../../model/user/user-schema";
import { UserValidationConstants } from "@/schemas/model/user/user-const";
import { emptyStringToUndefined } from "../../../common";
import type { ValidNamespaces } from "@/lib/typed-translations";

const { password } = UserValidationConstants;

const passwordSchema = z
  .string()
  .nonempty(
    "validation.pages.auth.register.password.required" as ValidNamespaces
  )
  .min(
    password.min,
    "validation.pages.auth.register.password.min" as ValidNamespaces
  )
  .max(
    password.max,
    "validation.pages.auth.register.password.max" as ValidNamespaces
  )
  .regex(
    password.noUpperCaseRegex,
    "validation.pages.auth.register.password.noUpperCase" as ValidNamespaces
  )
  .regex(
    password.noLowerCaseRegex,
    "validation.pages.auth.register.password.noLowerCase" as ValidNamespaces
  )
  .regex(
    password.noDigitRegex,
    "validation.pages.auth.register.password.noDigit" as ValidNamespaces
  )
  .regex(
    password.noSpecialCharRegex,
    "validation.pages.auth.register.password.noSpecialChar" as ValidNamespaces
  );

const repeatPasswordSchema = z
  .string()
  .nonempty(
    "validation.pages.auth.register.repeatPassword.required" as ValidNamespaces
  );

export const registerFormSchema = z
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
    message:
      "validation.pages.auth.register.repeatPassword.mismatch" as ValidNamespaces,
    path: ["repeatPassword"],
  });

export { passwordSchema, repeatPasswordSchema };
