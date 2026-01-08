import Link from "next/link";
import { Box, Flex } from "@chakra-ui/react";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import LogoDark from "@/assets/common/logo-darkmode.svg";
import { ROUTES } from "@/routes";
import { baseConfig } from "@/club-preset/baseConfig";
import ResponsiveHeading from "../texts/ResponsiveHeading";

export default function FooterLogo() {
  return (
    <Box width="100%">
    <Link href={ROUTES.dashboard} style={{ textDecoration: "none" }}>
      <Flex
        gap={2}
        mr={100}
        cursor="pointer"
        alignItems="center"
        rowGap={{ base: "0.5rem", md: "1rem" }}
      >
        <ChakraSVG
          svg={LogoDark}
          aria-label="Logo"
          w={{ base: "3rem", md: "4rem" }}
        />
        <ResponsiveHeading
          text={baseConfig.appName}
          showBar={false}
          fontSize="4xl"
          color="white"
          whiteSpace="nowrap"
        />
      </Flex>
    </Link>
    </Box>
  );
}
