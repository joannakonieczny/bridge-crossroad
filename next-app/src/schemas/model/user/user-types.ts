import type { z } from "zod";
import type * as s from "./user-schema";

export type UserNameType = z.infer<typeof s.nameSchema>;

export type FirstNameType = z.infer<typeof s.firstNameSchema>;
export type LastNameType = z.infer<typeof s.lastNameSchema>;

export type UserOnboardingType = z.infer<typeof s.onboardingDataSchema>;

export type AcademyType = z.infer<typeof s.academySchema>;
export type YearOfBirthType = z.infer<typeof s.yearOfBirthSchema>;
export type StartPlayingDateType = z.infer<typeof s.startPlayingDateSchema>;
export type TrainingGroupType = z.infer<typeof s.trainingGroupSchema>;
export type HasRefereeLicenseType = z.infer<typeof s.hasRefereeLicenseSchema>;
export type CezarIdSchemaType = z.infer<typeof s.cezarIdSchema>;
export type BboIdSchemaType = z.infer<typeof s.bboIdSchema>;
export type CuebidsIdType = z.infer<typeof s.cuebidsIdSchema>;

export type EmailType = z.infer<typeof s.emailSchema>;
export type NicknameType = z.infer<typeof s.nicknameSchema>;

export type PasswordTypeGeneric = string;
export type UserIdType = string;

export type UserType = z.infer<typeof s.userSchema>;
export type UserTypeBasic = z.infer<typeof s.userSchemaBasic>;
export type UserTypeBasicWithOnboarding = UserTypeBasic & {
  onboardingData: UserOnboardingType | undefined;
};
