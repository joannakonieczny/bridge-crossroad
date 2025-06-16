// TODO firewall

import { requireUserOnboarding } from "@/services/onboarding/actions";
import Navbar from "@/components/with-onboarding/Navbar";
import { Flex } from "@chakra-ui/react";

export default async function WithOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUserOnboarding();
  return (
    <Flex direction={"column"} height="100vh">
      <Navbar />
      {children}
    </Flex>
  );
}
