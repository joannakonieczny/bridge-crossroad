import { z } from "zod";
import { Academy } from "../../../club-preset/academy";
import { TrainingGroup } from "../../../club-preset/training-group";
import { UserValidationConstants } from "./user-const";
import type { ValidNamespaces } from "@/lib/typed-translations";

///////////////////////////////
// UserName - Schemas

const { name } = UserValidationConstants;

export const firstNameSchema = z
  .string()
  .nonempty("validation.model.user.name.firstName.required" as ValidNamespaces)
  .min(name.min, "validation.model.user.name.firstName.min" as ValidNamespaces)
  .max(name.max, "validation.model.user.name.firstName.max" as ValidNamespaces)
  .regex(
    name.regex,
    "validation.model.user.name.firstName.regex" as ValidNamespaces
  );

export const lastNameSchema = z
  .string()
  .nonempty("validation.model.user.name.lastName.required" as ValidNamespaces)
  .min(name.min, "validation.model.user.name.lastName.min" as ValidNamespaces)
  .max(name.max, "validation.model.user.name.lastName.max" as ValidNamespaces)
  .regex(
    name.regex,
    "validation.model.user.name.lastName.regex" as ValidNamespaces
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
    message:
      "validation.model.user.onboarding.academy.invalid" as ValidNamespaces,
  }),
});

export const yearOfBirthSchema = z
  .number()
  .int()
  .min(
    yearOfBirth.min,
    "validation.model.user.onboarding.yearOfBirth.min" as ValidNamespaces
  )
  .max(
    yearOfBirth.max,
    "validation.model.user.onboarding.yearOfBirth.max" as ValidNamespaces
  );

export const startPlayingDateSchema = z.date();

export const trainingGroupSchema = z.nativeEnum(TrainingGroup, {
  errorMap: () => ({
    message:
      "validation.model.user.onboarding.trainingGroup.invalid" as ValidNamespaces,
  }),
});

export const hasRefereeLicenseSchema = z.boolean();

export const cezarIdSchema = z
  .string()
  .regex(
    cezarId.regex,
    "validation.model.user.onboarding.cezarId.regexLenght" as ValidNamespaces
  );

export const bboIdSchema = z
  .string()
  .nonempty("validation.model.user.onboarding.bboId.invalid" as ValidNamespaces)
  .max(
    platformIds.max,
    "validation.model.user.onboarding.bboId.max" as ValidNamespaces
  );

export const cuebidsIdSchema = z
  .string()
  .nonempty(
    "validation.model.user.onboarding.cuebidsId.invalid" as ValidNamespaces
  )
  .max(
    platformIds.max,
    "validation.model.user.onboarding.cuebidsId.max" as ValidNamespaces
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
  .string()
  .nonempty("validation.model.user.email.required" as ValidNamespaces)
  .max(email.max, "validation.model.user.email.max" as ValidNamespaces)
  .email("validation.model.user.email.regex" as ValidNamespaces);

export const nicknameSchema = z
  .string()
  .min(nickname.min, "validation.model.user.nickname.min" as ValidNamespaces)
  .max(nickname.max, "validation.model.user.nickname.max" as ValidNamespaces)
  .regex(
    nickname.regex,
    "validation.model.user.nickname.regex" as ValidNamespaces
  );

export const userSchema = z.object({
  email: emailSchema,
  nickname: nicknameSchema.optional(),
  name: nameSchema,
  onboardingData: onboardingDataSchema.optional(),
});
