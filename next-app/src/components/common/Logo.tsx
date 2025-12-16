"use client";

import { Flex, Heading, useColorMode } from "@chakra-ui/react";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import LogoLightSVG from "@/assets/common/logo-lightmode.svg";
import LogoDarkSVG from "@/assets/common/logo-darkmode.svg";
import { ROUTES } from "@/routes";
import { baseConfig } from "@/club-preset/baseConfig";
import ChakraLink from "../chakra-config/ChakraLink";

export default function Logo() {
  const { colorMode } = useColorMode();
  const LogoSVG = colorMode === "dark" ? LogoDarkSVG : LogoLightSVG;

  return (
    <ChakraLink
      href={ROUTES.landing_page}
      style={{
        textDecoration: "none",
      }}
    >
      <Flex gap={2} cursor="pointer" alignItems="center">
        <Heading as="h1" size="md" whiteSpace="nowrap">
          {baseConfig.appName}
        </Heading>
        <ChakraSVG
          svg={LogoSVG}
          width="1.875rem"
          height="1.75rem"
          mr="1rem"
          aria-label="Logo"
        />
      </Flex>
    </ChakraLink>
  );
}
