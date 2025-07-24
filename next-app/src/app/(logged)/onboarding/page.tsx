import { redirect, RedirectType } from "next/navigation";
import { ROUTES } from "@/routes";

export default function OnboardingPage() {
  redirect(ROUTES.onboarding.step_1, RedirectType.replace);
}
