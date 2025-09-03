import { Flex, Heading } from "@chakra-ui/react";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import LogoSVG from "@/assets/common/logo-lightmode.svg";
import { ROUTES } from "@/routes";
import { baseConfig } from "@/club-preset/baseConfig";
import ChakraLink from "../chakra-config/ChakraLink";

export default function Logo() {
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
