import { OnboardingFormDataProvider } from "@/components/onboarding/FormDataContext";
import { Box, Container, Flex } from "@chakra-ui/react";
import * as React from "react";
import Image from "next/image";

export interface IOnboardingLayoutProps {
  children?: React.ReactNode;
}

export default function OnboardingLayout({ children }: IOnboardingLayoutProps) {
  return (
    <Box position="relative" minH="100vh" w="100vw" overflow="hidden">
      {/* Background images */}
      <Flex
        position="absolute"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        zIndex={0}
        display={{ base: "none", xl: "flex" }}
      >
        <Box w="50%" h="100%">
          <Image
            src="/onboarding/splash-art-lightmode-left.svg"
            alt="Splash Art Left"
            fill
            style={{ objectFit: "contain", objectPosition: "left top" }}
            sizes="50vw 100vh"
            priority
          />
        </Box>
        <Box w="50%" h="100%">
          <Image
            src="/onboarding/splash-art-lightmode-right.svg"
            alt="Splash Art Right"
            fill
            style={{ objectFit: "contain", objectPosition: "right top" }}
            sizes="50vw 100vh"
            priority
          />
        </Box>
      </Flex>
      {/* Kontener na wierzchu */}
      <Container
        maxWidth="container.md"
        position="relative"
        h="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <OnboardingFormDataProvider>{children}</OnboardingFormDataProvider>
      </Container>
    </Box>
  );
}
