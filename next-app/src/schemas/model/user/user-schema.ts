import { useTranslations } from "next-intl";
import { z } from "zod";
import { Academy } from "../../../club-preset/academy";
import { TrainingGroup } from "../../../club-preset/training-group";
import { getTranslations } from "next-intl/server";
import { TranslationFunction } from "../../common";
import { UserValidationConstants } from "./user-const";

///////////////////////////////
// UserName - SchemaProvider

function _UserNameSchemaProvider(t: TranslationFunction) {
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

export type Z_UserNameSchema = ReturnType<
  typeof _UserNameSchemaProvider
>["nameSchema"];

export type Z_FirstNameSchema = ReturnType<
  typeof UserNameSchemaProvider
>["firstNameSchema"];

export type Z_LastNameSchema = ReturnType<
  typeof UserNameSchemaProvider
>["lastNameSchema"];

export function UserNameSchemaProvider() {
  // for client use
  const t = useTranslations("validation.user.name");
  return _UserNameSchemaProvider(t);
}

export async function UserNameSchemaProviderServer() {
  // for server use
  const translation = await getTranslations("validation.user.name");
  return _UserNameSchemaProvider(translation);
}

///////////////////////////////
// UserOnboarding - SchemaProvider

function _UserOnboardingSchemaProvider(t: TranslationFunction) {
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

  const trainingGroupSchema = z.nativeEnum(TrainingGroup, {
    errorMap: () => ({ message: t("trainingGroup.invalid") }),
  });

  const hasRefereeLicenseSchema = z.boolean();

  const cezarIdSchema = z
    .string()
    .regex(cezarId.regex, t("cezarId.regexLenght", { lenght: cezarId.length }));

  const bboIdSchema = z
    .string()
    .nonempty("bboId.invalid")
    .max(platformIds.max, t("bboId.max", { max: platformIds.max }));

  const cuebidsIdSchema = z
    .string()
    .nonempty("cuebidsId.invalid")
    .max(platformIds.max, t("cuebidsId.max", { max: platformIds.max }));

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

export type Z_UserOnboardingSchema = ReturnType<
  typeof _UserOnboardingSchemaProvider
>["onboardingDataSchema"];

export type Z_AcademySchema = ReturnType<
  typeof UserOnboardingSchemaProvider
>["academySchema"];

export type Z_YearOfBirthSchema = ReturnType<
  typeof UserOnboardingSchemaProvider
>["yearOfBirthSchema"];

export type Z_StartPlayingDateSchema = ReturnType<
  typeof UserOnboardingSchemaProvider
>["startPlayingDateSchema"];

export type Z_TrainingGroupSchema = ReturnType<
  typeof UserOnboardingSchemaProvider
>["trainingGroupSchema"];

export type Z_HasRefereeLicenseSchema = ReturnType<
  typeof UserOnboardingSchemaProvider
>["hasRefereeLicenseSchema"];

export type Z_CezarIdSchema = ReturnType<
  typeof UserOnboardingSchemaProvider
>["cezarIdSchema"];

export type Z_BboIdSchema = ReturnType<
  typeof UserOnboardingSchemaProvider
>["bboIdSchema"];

export type Z_CuebidsIdSchema = ReturnType<
  typeof UserOnboardingSchemaProvider
>["cuebidsIdSchema"];

export function UserOnboardingSchemaProvider() {
  // for client use
  const t = useTranslations("validation.user.onboarding");
  return _UserOnboardingSchemaProvider(t);
}

export async function UserOnboardingSchemaProviderServer() {
  // for server use
  const t = await getTranslations("validation.user.onboarding");
  return _UserOnboardingSchemaProvider(t);
}

///////////////////////////////
// User - SchemaProvider

function _UserSchemaProvider(
  t: TranslationFunction,
  nameSchema: Z_UserNameSchema,
  onboardingDataSchema: Z_UserOnboardingSchema
) {
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
    .regex(nickname.regex, t("nickname.regex"));

  const userSchema = z.object({
    email: emailSchema,
    nickname: nicknameSchema.optional(),
    name: nameSchema,
    onboardingdata: onboardingDataSchema,
  });

  return { nicknameSchema, emailSchema, userSchema };
}

export type Z_UserSchema = ReturnType<typeof UserSchemaProvider>["userSchema"];

export type Z_EmailSchema = ReturnType<
  typeof UserSchemaProvider
>["emailSchema"];

export type Z_NicknameSchema = ReturnType<
  typeof UserSchemaProvider
>["nicknameSchema"];

export function UserSchemaProvider() {
  // for client use
  const t = useTranslations("validation.user");
  const { nameSchema } = UserNameSchemaProvider();
  const { onboardingDataSchema } = UserOnboardingSchemaProvider();
  return _UserSchemaProvider(t, nameSchema, onboardingDataSchema);
}

export async function UserSchemaProviderServer() {
  // for server use
  const t = await getTranslations("validation.user");
  const { nameSchema } = await UserNameSchemaProviderServer();
  const { onboardingDataSchema } = await UserOnboardingSchemaProviderServer();
  return _UserSchemaProvider(t, nameSchema, onboardingDataSchema);
}
