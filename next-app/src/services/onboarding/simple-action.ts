import { getUserData } from "@/repositories/onboarding";
import { ROUTES } from "@/routes";
import { sanitizeOnboardingData } from "@/sanitizers/server-only/user-sanitize";
import { redirect } from "next/navigation";
import { requireUserId } from "../auth/simple-action";
import type { UserIdType } from "@/schemas/model/user/user-types";

export async function requireUserOnboarding(userId?: UserIdType) {
  userId = userId || (await requireUserId()); // redirects if user is not authenticated
  const user = await getUserData(userId);

  if (!user || !user.onboardingData) {
    redirect(ROUTES.onboarding.index);
  }

  return sanitizeOnboardingData(user.onboardingData);
}
