"use server";

import {
  addOnboardingData,
  getUserData,
  OnboardingDataParams,
} from "@/controller/onboarding";
import { requireUserId } from "../auth/actions";
import { redirect } from "next/navigation";
import {
  SanitizedUser,
  sanitizeOnboardingData,
  sanitizeUser,
} from "./server-only/sanitize";

type OnboardingFormValues = OnboardingDataParams;

export async function completeOnboarding(
  onboardingData: OnboardingFormValues
): Promise<SanitizedUser> {
  const userId = await requireUserId(); // TODO maybe throw error if user is not authenticated?
  const updatedUser = await addOnboardingData(userId, onboardingData);
  if (!updatedUser) {
    throw new Error("Failed to update onboarding data");
  }
  return sanitizeUser(updatedUser);
}

export async function getUser(): Promise<SanitizedUser> {
  //TODO return less data
  const userId = await requireUserId(); // TODO maybe throw error if user is not authenticated?
  const user = await getUserData(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return sanitizeUser(user);
}

type OnboardingData = OnboardingDataParams;

export async function requireUserOnboarding(): Promise<OnboardingData> {
  const userId = await requireUserId(); // TODO maybe throw error if user is not authenticated?
  const user = await getUserData(userId);

  if (!user || !user.onboardingData) {
    redirect("/onboarding");
  }

  return sanitizeOnboardingData(user.onboardingData);
}
