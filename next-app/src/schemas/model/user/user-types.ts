import { z } from "zod";
import {
  Z_AcademySchema,
  Z_BboIdSchema,
  Z_CezarIdSchema,
  Z_CuebidsIdSchema,
  Z_EmailSchema,
  Z_FirstNameSchema,
  Z_HasRefereeLicenseSchema,
  Z_LastNameSchema,
  Z_NicknameSchema,
  Z_StartPlayingDateSchema,
  Z_TrainingGroupSchema,
  Z_UserNameSchema,
  Z_UserOnboardingSchema,
  Z_UserSchema,
  Z_YearOfBirthSchema,
} from "./user-schema";

export type UserNameType = z.infer<Z_UserNameSchema>;

export type FirstNameType = z.infer<Z_FirstNameSchema>;
export type LastNameType = z.infer<Z_LastNameSchema>;

export type UserOnboardingType = z.infer<Z_UserOnboardingSchema>;

export type AcademyType = z.infer<Z_AcademySchema>;
export type YearOfBirthType = z.infer<Z_YearOfBirthSchema>;
export type StartPlayingDateType = z.infer<Z_StartPlayingDateSchema>;
export type TrainingGroupType = z.infer<Z_TrainingGroupSchema>;
export type HasRefereeLicenseType = z.infer<Z_HasRefereeLicenseSchema>;
export type CezarIdSchemaType = z.infer<Z_CezarIdSchema>;
export type BboIdSchemaType = z.infer<Z_BboIdSchema>;
export type CuebidsIdType = z.infer<Z_CuebidsIdSchema>;

export type UserType = z.infer<Z_UserSchema>;

export type EmailType = z.infer<Z_EmailSchema>;
export type NicknameType = z.infer<Z_NicknameSchema>;

export type PasswordTypeGeneric = string;
