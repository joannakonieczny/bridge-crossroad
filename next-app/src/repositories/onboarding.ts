"server-only";

import User from "@/models/user/user-model";
import dbConnect from "@/util/connect-mongo";
import { check } from "./common";
import type { IUserDTO } from "@/models/user/user-types";
import type {
  UserIdType,
  UserOnboardingType,
} from "@/schemas/model/user/user-types";

export async function addOnboardingData(
  userId: UserIdType,
  onboardingData: UserOnboardingType
) {
  await dbConnect();

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { onboardingData },
    {
      new: true, // returns the updated document
      runValidators: true,
    }
  ).lean<IUserDTO>();

  return check(updatedUser, "Failed to update user with onboarding data");
}

export async function getUserData(userId: UserIdType) {
  await dbConnect();
  const user = await User.findById(userId).lean<IUserDTO>();
  return check(user, "User not found");
}
