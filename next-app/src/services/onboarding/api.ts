"use server";

import { addOnboardingData, getUserData } from "@/repositories/onboarding";
import { requireUserId } from "../auth/simple-action";
import { sanitizeUser } from "../../sanitizers/server-only/user-sanitize";
import { action } from "../action-lib";
import { onboardingDataSchema } from "@/schemas/model/user/user-schema";

export const completeOnboardingAndJoinMainGroup = action
  .inputSchema(onboardingDataSchema)
  .action(async ({ parsedInput: onboardingData }) => {
    const userId = await requireUserId(); // redirects if user is not authenticated
    const updatedUser = await addOnboardingData(userId, onboardingData);
    return sanitizeUser(updatedUser);
  });

export const getUser = action.action(async () => {
  //TODO return less data
  const userId = await requireUserId(); // redirects if user is not authenticated
  const user = await getUserData(userId);
  return sanitizeUser(user);
});
