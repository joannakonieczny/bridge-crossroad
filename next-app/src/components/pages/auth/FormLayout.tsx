import { Box, HStack, Stack, Text, useColorMode } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { baseConfig } from "@/club-preset/baseConfig";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import LogoLightSVG from "@/assets/common/logo-lightmode.svg";
import LogoDarkSVG from "@/assets/common/logo-darkmode.svg";

export default function FormLayout({ children }: PropsWithChildren) {
  const { colorMode } = useColorMode();
  const LogoSVG = colorMode === "dark" ? LogoDarkSVG : LogoLightSVG;
  const [firstWord, secondWord] = baseConfig.appName.split(" ");
  return (
    <Stack mb={8}>
      {/* Logo and appName */}
      <HStack justify="space-between">
        <HStack>
          <Box w="8px" h="80px" bg="accent.500" borderRadius="2px" />
          <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
            {firstWord} <br /> {secondWord}
          </Text>
        </HStack>
        <ChakraSVG svg={LogoSVG} h="100px" aria-label="logo" />
      </HStack>

      {children}
    </Stack>
  );
}
