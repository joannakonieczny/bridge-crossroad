import { requireUserOnboarding } from "@/services/onboarding/actions";
import { ReactNode } from "react";

export default async function WithOnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUserOnboarding();
  return <>{children}</>;
}
