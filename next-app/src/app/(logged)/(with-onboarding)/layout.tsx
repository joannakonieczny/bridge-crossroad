import { requireUserOnboarding } from "@/services/onboarding/simple-action";
import Navbar from "@/components/pages/with-onboarding/navbar/Navbar";
import { Flex } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

// firewall for only logged users & completed onboarding
export default async function WithOnboardingLayout({
  children,
}: PropsWithChildren) {
  await requireUserOnboarding();
  return (
    <Flex direction={"column"} height="100vh">
      <Navbar />
      {children}
    </Flex>
  );
}
