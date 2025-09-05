"server-only";

import type { IUserDTO } from "@/models/user/user-types";
import User from "@/models/user/user-model";
import type {
  UserIdType,
  UserOnboardingType,
} from "@/schemas/model/user/user-types";
import dbConnect from "@/util/connect-mongo";

export async function addOnboardingData(
  userId: UserIdType,
  onboardingData: UserOnboardingType
) {
  await dbConnect();

  return await User.findByIdAndUpdate(
    userId,
    { onboardingData },
    {
      new: true, // returns the updated document
      runValidators: true,
    }
  ).lean<IUserDTO>();
}

export async function getUserData(userId: UserIdType) {
  await dbConnect();
  return await User.findById(userId).lean<IUserDTO>();
}
