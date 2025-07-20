"use server";

import { addOnboardingData, getUserData } from "@/repositories/onboarding";
import { requireUserId } from "../auth/actions";
import { redirect } from "next/navigation";
import {
  sanitizeOnboardingData,
  sanitizeUser,
} from "../../sanitizers/server-only/user-sanitize";
import { action } from "../action-lib";
import { UserOnboardingSchemaProviderServer } from "@/schemas/model/user/user-schema";

export const completeOnboarding = action
  .inputSchema(
    (await UserOnboardingSchemaProviderServer()).onboardingDataSchema
  )
  .action(async ({ parsedInput: onboardingData }) => {
    const userId = await requireUserId(); // redirects if user is not authenticated
    const updatedUser = await addOnboardingData(userId, onboardingData);
    if (!updatedUser) {
      throw new Error("Failed to update onboarding data");
    }
    return sanitizeUser(updatedUser);
  });

export const getUser = action.action(async () => {
  //TODO return less data
  const userId = await requireUserId(); // redirects if user is not authenticated
  const user = await getUserData(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return sanitizeUser(user);
});

// TODO: change to safe server-action if needed

export async function requireUserOnboarding() {
  const userId = await requireUserId(); // redirects if user is not authenticated
  const user = await getUserData(userId);

  if (!user || !user.onboardingData) {
    redirect("/onboarding");
  }

  return sanitizeOnboardingData(user.onboardingData);
}
