import { z } from "zod";
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  nicknameSchema,
} from "@/schemas/model/user/user-schema";
import type { TKey } from "@/lib/typed-translations";
import { UserValidationConstants } from "@/schemas/model/user/user-const";
import {
  onboardingFirstPageSchema,
  onboardingSecondPageSchema,
  onboardingThirdPageSchema,
} from "@/schemas/pages/onboarding/onboarding-schema";

export const changeEmailSchema = z.object({
  newEmail: emailSchema,
});

const { password } = UserValidationConstants;

const passwordSchema = z
  .string({
    message: "validation.pages.user.password.required" satisfies TKey,
  })
  .min(password.min, "validation.pages.user.password.min" satisfies TKey)
  .max(password.max, "validation.pages.user.password.max" satisfies TKey)
  .regex(
    password.noUpperCaseRegex,
    "validation.pages.user.password.noUpperCase" satisfies TKey
  )
  .regex(
    password.noLowerCaseRegex,
    "validation.pages.user.password.noLowerCase" satisfies TKey
  )
  .regex(
    password.noDigitRegex,
    "validation.pages.user.password.noDigit" satisfies TKey
  )
  .regex(
    password.noSpecialCharRegex,
    "validation.pages.user.password.noSpecialChar" satisfies TKey
  );

const repeatPasswordSchema = z
  .string({
    message: "validation.pages.user.repeatPassword.required" satisfies TKey,
  })
  .nonempty("validation.pages.user.repeatPassword.required" satisfies TKey);

const oldPasswordSchema = z
  .string({
    message: "validation.pages.user.oldPassword.required" satisfies TKey,
  })
  .nonempty("validation.pages.user.oldPassword.required" satisfies TKey);

export const changePasswordSchema = z
  .object({
    oldPassword: oldPasswordSchema,
    newPassword: passwordSchema,
    repeatNewPassword: repeatPasswordSchema,
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "validation.pages.user.repeatPassword.mismatch" satisfies TKey,
    path: ["repeatNewPassword"],
  });

export const changeProfileSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  nickname: nicknameSchema.optional(),
});

export const changeOnboardingDataSchema = onboardingFirstPageSchema
  .merge(onboardingSecondPageSchema)
  .merge(onboardingThirdPageSchema);
