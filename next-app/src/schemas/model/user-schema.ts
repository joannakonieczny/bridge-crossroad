import { useTranslations } from "next-intl";
import { z } from "zod";
import { Academy } from "../../club-preset/academy";
import { TrainingGroup as TrainingGroupp } from "../../club-preset/training-group";

export const UserValidationConstants = {
  name: {
    min: 2,
    max: 50,
    regex: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
  },
  yearOfBirth: {
    min: 1900,
    max: new Date().getFullYear(),
  },
  cezarId: {
    length: 8,
    regex: /^\d{8}$/,
  },
  platformIds: {
    max: 20,
  },
  email: {
    max: 50,
  },
  nickname: {
    min: 3,
    max: 16,
    regex: /^[a-zA-Z0-9_-]+$/,
  },
  password: {
    min: 6,
    max: 16,
    noUpperCaseRegex: /(?=.*[A-Z])/,
    noLowerCaseRegex: /(?=.*[a-z])/,
    noDigitRegex: /(?=.*\d)/,
    noSpecialCharRegex: /(?=.*[!@#$%^&*(),.?":{}|<>])/,
  },
};

export function UserNameSchemaProvider() {
  const t = useTranslations("validation.user.name");
  const { name } = UserValidationConstants;

  const firstNameSchema = z
    .string()
    .nonempty(t("firstName.required"))
    .min(name.min, t("firstName.min", { min: name.min }))
    .max(name.max, t("firstName.max", { max: name.max }))
    .regex(name.regex, t("firstName.regex"));

  const lastNameSchema = z
    .string()
    .nonempty(t("lastName.required"))
    .min(name.min, t("lastName.min", { min: name.min }))
    .max(name.max, t("lastName.max", { max: name.max }))
    .regex(name.regex, t("lastName.regex"));

  const nameSchema = z.object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
  });

  return { firstNameSchema, lastNameSchema, nameSchema };
}

export function UserOnboardingSchemaProvider() {
  const t = useTranslations("validation.user.onboarding");
  const { yearOfBirth, cezarId, platformIds } = UserValidationConstants;

  const academySchema = z.nativeEnum(Academy, {
    errorMap: () => ({ message: t("academy.invalid") }),
  });

  const yearOfBirthSchema = z
    .number()
    .int()
    .min(yearOfBirth.min, t("yearOfBirth.min", { min: yearOfBirth.min }))
    .max(yearOfBirth.max, t("yearOfBirth.max", { max: yearOfBirth.max }));

  const startPlayingDateSchema = z.date();

  const trainingGroupSchema = z.nativeEnum(TrainingGroupp, {
    errorMap: () => ({ message: t("trainingGroup.invalid") }),
  });

  const hasRefereeLicenseSchema = z.boolean();

  const cezarIdSchema = z
    .string()
    .regex(cezarId.regex, t("cezarId.regexLenght", { lenght: cezarId.length }))
    .optional();

  const bboIdSchema = z
    .string()
    .nonempty("bboId.invalid")
    .max(platformIds.max, t("bboId.max", { max: platformIds.max }))
    .optional();

  const cuebidsIdSchema = z
    .string()
    .nonempty("cuebidsId.invalid")
    .max(platformIds.max, t("cuebidsId.max", { max: platformIds.max }))
    .optional();

  const onboardingDataSchema = z.object({
    academy: academySchema,
    yearOfBirth: yearOfBirthSchema,
    startPlayingDate: startPlayingDateSchema,
    trainingGroup: trainingGroupSchema,
    hasRefereeLicense: hasRefereeLicenseSchema,
    cezarId: cezarIdSchema.optional(),
    bboId: bboIdSchema.optional(),
    cuebidsId: cuebidsIdSchema.optional(),
  });

  return {
    academySchema,
    yearOfBirthSchema,
    startPlayingDateSchema,
    trainingGroupSchema,
    hasRefereeLicenseSchema,
    cezarIdSchema,
    bboIdSchema,
    cuebidsIdSchema,
    onboardingDataSchema,
  };
}

export function UserSchemaProvider() {
  const t = useTranslations("validation.user");
  const { nameSchema } = UserNameSchemaProvider();
  const { onboardingDataSchema } = UserOnboardingSchemaProvider();
  const { email, nickname } = UserValidationConstants;

  const emailSchema = z
    .string()
    .nonempty(t("email.required"))
    .max(email.max, t("email.max", { max: email.max }))
    .email(t("email.regex"));

  const nicknameSchema = z
    .string()
    .min(nickname.min, t("nickname.min", { min: nickname.min }))
    .max(nickname.max, t("nickname.max", { max: nickname.max }))
    .regex(nickname.regex, t("nickname.regex"))
    .optional();

  const userSchema = z.object({
    email: emailSchema,
    nickname: nicknameSchema,
    name: nameSchema,
    onboardingdata: onboardingDataSchema,
  });

  return { nicknameSchema, emailSchema, userSchema };
}
