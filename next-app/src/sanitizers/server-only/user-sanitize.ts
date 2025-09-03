"server-only";

import type { IUserDTO } from "@/models/user/user-types";
import type {
  AcademyType,
  TrainingGroupType,
  UserIdType,
  UserOnboardingType,
  UserType,
} from "@/schemas/model/user/user-types";

export type SanitizedUser = UserType & {
  _id: UserIdType;
  createdAt: Date;
  updatedAt: Date;
};

export type SanitizedOnboardingData = UserOnboardingType | undefined;

export function sanitizeOnboardingData(
  onboardingData: IUserDTO["onboardingData"]
): SanitizedOnboardingData {
  if (!onboardingData) return undefined;

  return {
    academy: onboardingData.academy as AcademyType,
    yearOfBirth: onboardingData.yearOfBirth,
    startPlayingDate: onboardingData.startPlayingDate,
    trainingGroup: onboardingData.trainingGroup as TrainingGroupType,
    hasRefereeLicense: onboardingData.hasRefereeLicense,
    cezarId: onboardingData.cezarId,
    bboId: onboardingData.bboId,
    cuebidsId: onboardingData.cuebidsId,
  };
}

export function sanitizeUser(user: IUserDTO): SanitizedUser {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: {
      firstName: user.name.firstName,
      lastName: user.name.lastName,
    },
    nickname: user.nickname,
    onboardingData: sanitizeOnboardingData(user.onboardingData),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
