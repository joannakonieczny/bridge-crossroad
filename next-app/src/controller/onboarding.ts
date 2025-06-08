"server-only";

import User, { IUserDTO } from "@/models/user";
import dbConnect from "@/util/connect-mongo";

export type OnboardingDataParams = IUserDTO["onboardingData"];

export async function addOnboardingData(
  userId: string,
  onboardingData: OnboardingDataParams
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

export async function getUserData(userId: string): Promise<IUserDTO | null> {
  await dbConnect();
  const user = await User.findById(userId);
  return user ? user.toObject() : null;
}
