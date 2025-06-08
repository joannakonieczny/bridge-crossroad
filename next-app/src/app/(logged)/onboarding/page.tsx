import { redirect, RedirectType } from "next/navigation";

export default function OnboardingPage() {
  redirect("/onboarding/1", RedirectType.replace);
}
