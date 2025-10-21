"server-only";

import type { IUserDTO } from "@/models/user/user-types";
import type {
  AcademyType,
  TrainingGroupType,
  UserOnboardingType,
  UserType,
  UserTypeBasic,
} from "@/schemas/model/user/user-types";

export function sanitizeOnboardingData(
  onboardingData: IUserDTO["onboardingData"]
): UserOnboardingType | undefined {
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

export function sanitizeMinUserInfo(user: IUserDTO): UserTypeBasic {
  return {
    id: user._id.toString(),
    name: {
      firstName: user.name.firstName,
      lastName: user.name.lastName,
    },
    nickname: user.nickname,
  };
}

export function sanitizeUser(user: IUserDTO): UserType {
  return {
    ...sanitizeMinUserInfo(user),
    email: user.email,
    onboardingData: sanitizeOnboardingData(user.onboardingData),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
