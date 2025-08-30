import { Box, Container, Flex } from "@chakra-ui/react";
import SplashArtLightmode from "@/assets/auth/splash-art-lightmode.svg";
import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Flex minH="100vh" position="relative" overflow={"hidden"}>
        {/* left side */}
        <Box
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
        >
          <Container maxW="md">{children}</Container>
        </Box>
        {/* right side with background image */}
        <Box
          flex="1"
          display={{ base: "none", lg: "block" }}
          position="relative"
        >
          <Box
            position="absolute"
            right={0}
            bottom={-1}
            zIndex={0}
            h="110vh"
            width={"100%"}
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <SplashArtLightmode />
          </Box>
        </Box>
      </Flex>
    </>
  );
}
