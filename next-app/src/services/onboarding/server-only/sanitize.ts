"server-only";

import { IUserDTO } from "@/models/user";
import { UserId } from "@/services/auth/server-only/user-id";

export type SanitizedUser = {
  _id: UserId;
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  nickname?: string;
  onboardingData?: {
    academy: string;
    yearOfBirth: number;
    startPlayingDate: string; // format MM-YYYY
    trainingGroup: string;
    hasRefereeLicence: boolean;
    cezarId?: string;
    bboId?: string;
    cuebidsId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export function sanitizeUser(user: IUserDTO): SanitizedUser {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: {
      firstName: user.name.firstName,
      lastName: user.name.lastName,
    },
    nickname: user.nickname,
    onboardingData: user.onboardingData
      ? {
          academy: user.onboardingData.academy,
          yearOfBirth: user.onboardingData.yearOfBirth,
          startPlayingDate: user.onboardingData.startPlayingDate,
          trainingGroup: user.onboardingData.trainingGroup,
          hasRefereeLicence: user.onboardingData.hasRefereeLicence,
          cezarId: user.onboardingData.cezarId,
          bboId: user.onboardingData.bboId,
          cuebidsId: user.onboardingData.cuebidsId,
        }
      : undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export type SanitizedOnboardingData = IUserDTO["onboardingData"];

export function sanitizeOnboardingData(
  onboardingData: IUserDTO["onboardingData"]
): SanitizedOnboardingData {
  if (!onboardingData) return undefined;

  return {
    academy: onboardingData.academy,
    yearOfBirth: onboardingData.yearOfBirth,
    startPlayingDate: onboardingData.startPlayingDate,
    trainingGroup: onboardingData.trainingGroup,
    hasRefereeLicence: onboardingData.hasRefereeLicence,
    cezarId: onboardingData.cezarId,
    bboId: onboardingData.bboId,
    cuebidsId: onboardingData.cuebidsId,
  };
}
