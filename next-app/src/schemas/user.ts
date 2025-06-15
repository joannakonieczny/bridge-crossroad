import { useTranslations } from "next-intl";
import z from "zod";
import { Academy } from "../club-preset/academy";
import { TrainingGroup as TrainingGroupp } from "../club-preset/training-group";

export function UserNameSchemaProvider() {
  const t = useTranslations("validation.user.name"); //TODO add translations

  const firstNameSchema = z
    .string()
    .min(2, t("firstName.min", { min: 2 }))
    .max(50, t("firstName.max", { max: 50 }))
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/, t("firstName.regex"));

  const lastNameSchema = z
    .string()
    .min(2, t("lastName.min", { min: 2 }))
    .max(50, t("lastName.max", { max: 50 }))
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/, t("lastName.regex"));

  const nameSchema = z.object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
  });

  return { firstNameSchema, lastNameSchema, nameSchema };
}

export function UserOnboardingSchemaProvider() {
  const t = useTranslations("validation.user.onboarding"); //TODO add translations

  const academySchema = z.nativeEnum(Academy, {
    errorMap: () => ({ message: t("academy.invalid") }),
  });

  const yearOfBirthSchema = z
    .number()
    .int()
    .min(1900, t("yearOfBirth.min", { min: 1900 }))
    .max(
      new Date().getFullYear(),
      t("yearOfBirth.max", { max: new Date().getFullYear() })
    );

  const startPlayingDateSchema = z.date();

  const trainingGroupSchema = z.nativeEnum(TrainingGroupp, {
    errorMap: () => ({ message: t("trainingGroup.invalid") }),
  });

  const hasRefereeLicenseSchema = z.boolean();

  const cezarIdSchema = z
    .string()
    .regex(/^\d{8}$/, t("cezarId.regexLenght", { lenght: 8 }))
    .optional();

  const bboIdSchema = z
    .string()
    .nonempty("bboId.invalid")
    .max(20, t("bboId.max", { max: 20 }))
    .optional();

  const cuebidsIdSchema = z
    .string()
    .nonempty("cuebidsId.invalid")
    .max(20, t("cuebidsId.max", { max: 20 }))
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
  const t = useTranslations("validation.user"); //TODO add translations
  const { nameSchema } = UserNameSchemaProvider();
  const { onboardingDataSchema } = UserOnboardingSchemaProvider();

  const emailSchema = z
    .string()
    .max(50, t("email.max", { max: 50 }))
    .email(t("email.regex"));

  const nicknameSchema = z
    .string()
    .min(3, t("nickname.min", { min: 3 }))
    .max(16, t("nickname.max", { max: 16 }))
    .regex(/^[a-zA-Z0-9_-]+$/, t("nickname.regex"));

  const userSchema = z.object({
    email: emailSchema,
    nickname: nicknameSchema,
    name: nameSchema,
    onboardingdata: onboardingDataSchema,
  });

  return { nicknameSchema, emailSchema, userSchema };
}
