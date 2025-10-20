"server-only";

import type { IUserDTO } from "@/models/user/user-types";
import type {
  AcademyType,
  TrainingGroupType,
  UserOnboardingType,
} from "@/schemas/model/user/user-types";

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

export function sanitizeMinUserInfo(user: IUserDTO) {
  return {
    id: user._id.toString(),
    name: {
      firstName: user.name.firstName,
      lastName: user.name.lastName,
    },
    nickname: user.nickname,
  };
}

export function sanitizeUser(user: IUserDTO) {
  return {
    ...sanitizeMinUserInfo(user),
    email: user.email,
    onboardingData: sanitizeOnboardingData(user.onboardingData),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
