// TODO firewall

import { requireUserOnboarding } from "@/services/onboarding/actions";

export default async function WithOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUserOnboarding();
  return <>{children}</>;
}
