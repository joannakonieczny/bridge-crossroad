import { z } from "zod";
import { Academy } from "../../../club-preset/academy";
import { TrainingGroup } from "../../../club-preset/training-group";
import { UserValidationConstants } from "./user-const";
import type { TKey } from "@/lib/typed-translations";
import { idPropSchema, withTimeStampsSchema } from "@/schemas/common";

///////////////////////////////
// UserName - Schemas

const { name } = UserValidationConstants;

export const firstNameSchema = z
  .string({
    message: "validation.model.user.name.firstName.required" satisfies TKey,
  })
  .nonempty("validation.model.user.name.firstName.required" satisfies TKey)
  .min(name.min, "validation.model.user.name.firstName.min" satisfies TKey)
  .max(name.max, "validation.model.user.name.firstName.max" satisfies TKey)
  .regex(
    name.regex,
    "validation.model.user.name.firstName.regex" satisfies TKey
  );

export const lastNameSchema = z
  .string({
    message: "validation.model.user.name.lastName.required" satisfies TKey,
  })
  .nonempty("validation.model.user.name.lastName.required" satisfies TKey)
  .min(name.min, "validation.model.user.name.lastName.min" satisfies TKey)
  .max(name.max, "validation.model.user.name.lastName.max" satisfies TKey)
  .regex(
    name.regex,
    "validation.model.user.name.lastName.regex" satisfies TKey
  );

export const nameSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

///////////////////////////////
// UserOnboarding - Schemas

const { yearOfBirth, cezarId, platformIds } = UserValidationConstants;

export const academySchema = z.nativeEnum(Academy, {
  errorMap: () => ({
    message: "validation.model.user.onboarding.academy.invalid" satisfies TKey,
  }),
});

export const yearOfBirthSchema = z
  .number()
  .int()
  .min(
    yearOfBirth.min,
    "validation.model.user.onboarding.yearOfBirth.min" satisfies TKey
  )
  .max(
    yearOfBirth.max,
    "validation.model.user.onboarding.yearOfBirth.max" satisfies TKey
  );

export const startPlayingDateSchema = z.date();

export const trainingGroupSchema = z.nativeEnum(TrainingGroup, {
  errorMap: () => ({
    message:
      "validation.model.user.onboarding.trainingGroup.invalid" satisfies TKey,
  }),
});

export const hasRefereeLicenseSchema = z.boolean();

export const cezarIdSchema = z
  .string()
  .regex(
    cezarId.regex,
    "validation.model.user.onboarding.cezarId.regex" satisfies TKey
  );

export const bboIdSchema = z
  .string()
  .nonempty("validation.model.user.onboarding.bboId.invalid" satisfies TKey)
  .max(
    platformIds.max,
    "validation.model.user.onboarding.bboId.max" satisfies TKey
  );

export const cuebidsIdSchema = z
  .string()
  .nonempty("validation.model.user.onboarding.cuebidsId.invalid" satisfies TKey)
  .max(
    platformIds.max,
    "validation.model.user.onboarding.cuebidsId.max" satisfies TKey
  );

export const onboardingDataSchema = z.object({
  academy: academySchema,
  yearOfBirth: yearOfBirthSchema,
  startPlayingDate: startPlayingDateSchema,
  trainingGroup: trainingGroupSchema,
  hasRefereeLicense: hasRefereeLicenseSchema,
  cezarId: cezarIdSchema.optional(),
  bboId: bboIdSchema.optional(),
  cuebidsId: cuebidsIdSchema.optional(),
});

///////////////////////////////
// User - Schemas

const { email, nickname } = UserValidationConstants;

export const emailSchema = z
  .string({
    message: "validation.model.user.email.required" satisfies TKey,
  })
  .nonempty("validation.model.user.email.required" satisfies TKey)
  .max(email.max, "validation.model.user.email.max" satisfies TKey)
  .email("validation.model.user.email.regex" satisfies TKey)
  .regex(
    email.additionalRegex,
    "validation.model.user.email.regex" satisfies TKey
  );

export const nicknameSchema = z
  .string()
  .min(nickname.min, "validation.model.user.nickname.min" satisfies TKey)
  .max(nickname.max, "validation.model.user.nickname.max" satisfies TKey)
  .regex(nickname.regex, "validation.model.user.nickname.regex" satisfies TKey);

///////////////////////////////
// Full User - Schema

export const userSchema = z
  .object({
    id: idPropSchema,
    name: nameSchema,
    nickname: nicknameSchema.optional(),
    email: emailSchema,
    onboardingData: onboardingDataSchema.optional(),
  })
  .merge(withTimeStampsSchema);

export const userSchemaBasic = z.object({
  id: idPropSchema,
  name: nameSchema,
  nickname: nicknameSchema.optional(),
});

export const userSchemaBasicWithOnboarding = userSchemaBasic.extend({
  onboardingData: onboardingDataSchema.optional(),
});
