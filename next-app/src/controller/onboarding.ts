"server-only";

import User, { IUserDTO } from "@/models/user";
import {
  UserIdType,
  UserOnboardingType,
} from "@/schemas/model/user/user-types";
import dbConnect from "@/util/connect-mongo";

export async function addOnboardingData(
  userId: UserIdType,
  onboardingData: UserOnboardingType
): Promise<IUserDTO | null> {
  await dbConnect();

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { onboardingData },
    {
      new: true, // returns the updated document
      runValidators: true,
    }
  );

  return updatedUser ? updatedUser.toObject() : null;
}

export async function getUserData(
  userId: UserIdType
): Promise<IUserDTO | null> {
  await dbConnect();
  const user = await User.findById(userId);
  return user ? user.toObject() : null;
}
