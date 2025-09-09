"use server";

import { addOnboardingData, getUserData } from "@/repositories/onboarding";
import { requireUserId } from "../auth/simple-action";
import { sanitizeUser } from "../../sanitizers/server-only/user-sanitize";
import { action } from "../action-lib";
import { completeOnboardingAndJoinMainGroupSchema } from "@/schemas/pages/onboarding/onboarding-schema";
import { addUserToGroup } from "@/repositories/user-groups";
import { getMainGroup } from "@/repositories/groups";
import { returnValidationErrors } from "next-safe-action";
import type { TKey } from "@/lib/typed-translations";

export const completeOnboardingAndJoinMainGroup = action
  .inputSchema(completeOnboardingAndJoinMainGroupSchema)
  .action(async ({ parsedInput: onboardingData }) => {
    const userId = await requireUserId(); // redirects if user is not authenticated
    await addOnboardingData(userId, onboardingData);
    const mainGroup = await getMainGroup();
    if (mainGroup.invitationCode != onboardingData.inviteCode) {
      returnValidationErrors(completeOnboardingAndJoinMainGroupSchema, {
        inviteCode: {
          _errors: [
            "api.onboarding.finalPage.inviteCode.invalid" satisfies TKey,
          ],
        },
      });
    }
    const res = await addUserToGroup({
      userId,
      groupId: mainGroup._id.toString(),
    });
    return sanitizeUser(res.user);
  });

export const getUser = action.action(async () => {
  //TODO return less data
  const userId = await requireUserId(); // redirects if user is not authenticated
  const user = await getUserData(userId);
  return sanitizeUser(user);
});
