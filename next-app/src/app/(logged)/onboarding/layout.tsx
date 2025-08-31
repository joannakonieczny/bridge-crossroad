import { OnboardingFormDataProvider } from "@/components/pages/onboarding/FormDataContext";
import { Box, Container, Flex } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import OnboardingLeft from "@/assets/onboarding/splash-art-lightmode-left.svg";
import OnboardingRight from "@/assets/onboarding/splash-art-lightmode-right.svg";

export default function OnboardingLayout({ children }: PropsWithChildren) {
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
        justifyContent="space-between"
      >
        <ChakraSVG svg={OnboardingLeft} aria-label="Splash Art Left" />
        <ChakraSVG svg={OnboardingRight} aria-label="Splash Art Right" />
      </Flex>
      {/* form page container */}
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
