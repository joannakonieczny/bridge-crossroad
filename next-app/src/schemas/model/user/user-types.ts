import type { z } from "zod";
import type {
  academySchema,
  bboIdSchema,
  cezarIdSchema,
  cuebidsIdSchema,
  emailSchema,
  firstNameSchema,
  hasRefereeLicenseSchema,
  lastNameSchema,
  nameSchema,
  nicknameSchema,
  onboardingDataSchema,
  startPlayingDateSchema,
  trainingGroupSchema,
  userSchema,
  userSchemaBasic,
  yearOfBirthSchema,
} from "./user-schema";

export type UserNameType = z.infer<typeof nameSchema>;

export type FirstNameType = z.infer<typeof firstNameSchema>;
export type LastNameType = z.infer<typeof lastNameSchema>;

export type UserOnboardingType = z.infer<typeof onboardingDataSchema>;

export type AcademyType = z.infer<typeof academySchema>;
export type YearOfBirthType = z.infer<typeof yearOfBirthSchema>;
export type StartPlayingDateType = z.infer<typeof startPlayingDateSchema>;
export type TrainingGroupType = z.infer<typeof trainingGroupSchema>;
export type HasRefereeLicenseType = z.infer<typeof hasRefereeLicenseSchema>;
export type CezarIdSchemaType = z.infer<typeof cezarIdSchema>;
export type BboIdSchemaType = z.infer<typeof bboIdSchema>;
export type CuebidsIdType = z.infer<typeof cuebidsIdSchema>;

export type EmailType = z.infer<typeof emailSchema>;
export type NicknameType = z.infer<typeof nicknameSchema>;

export type PasswordTypeGeneric = string;
export type UserIdType = string;

export type UserType = z.infer<typeof userSchema>;
export type UserTypeBasic = z.infer<typeof userSchemaBasic>;
