import Link from "next/link";
import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import { ROUTES } from "@/routes";
import { baseConfig } from "@/club-preset/baseConfig";
import ResponsiveHeading from "../texts/ResponsiveHeading";

export default function FooterLogo() {

  return (
    <Link href={ROUTES.dashboard} style={{ textDecoration: "none" }}>
      <Flex gap={2} mr={100} cursor="pointer" alignItems="center">
        <Box
          minWidth={{ base: "3rem", md: "4rem" }}
          minHeight={{ base: "2.77rem", md: "3.69rem" }}
          position="relative"
          marginRight={{base: "0.5rem", md: "1rem"}}
        >
          <Image
            src="/assets/common/logo-darkmode.svg"
            alt="Logo"
            fill
            style={{ objectFit: "contain", objectPosition: "left top" }}
          />
        </Box>
        <ResponsiveHeading text={baseConfig.appName} showBar={false} fontSize="4xl" color="white" whiteSpace="nowrap"/>
      </Flex>
    </Link>
  );
}
