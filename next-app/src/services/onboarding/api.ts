"use server";

import { addOnboardingData, getUserData } from "@/repositories/onboarding";
import { sanitizeUser } from "../../sanitizers/server-only/user-sanitize";
import { authAction } from "../action-lib";
import { completeOnboardingAndJoinMainGroupSchema } from "@/schemas/pages/onboarding/onboarding-schema";
import { addUserToGroup } from "@/repositories/user-groups";
import { getMainGroup } from "@/repositories/groups";
import { returnValidationErrors } from "next-safe-action";
import type { TKey } from "@/lib/typed-translations";

export const completeOnboardingAndJoinMainGroup = authAction
  .inputSchema(completeOnboardingAndJoinMainGroupSchema)
  .action(async ({ parsedInput: onboardingData, ctx: { userId } }) => {
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

export const getUser = authAction.action(async ({ ctx: { userId } }) => {
  //TODO return less data
  const user = await getUserData(userId);
  return sanitizeUser(user);
});
