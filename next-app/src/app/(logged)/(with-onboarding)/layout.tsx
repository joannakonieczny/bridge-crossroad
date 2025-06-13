// TODO firewall

import { requireUserOnboarding } from "@/services/onboarding/actions";
import Navbar from "@/components/with-onboarding/Navbar";

export default async function WithOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUserOnboarding();
  return(
    <>
      <Navbar />
      {children}
    </>
  );
}
