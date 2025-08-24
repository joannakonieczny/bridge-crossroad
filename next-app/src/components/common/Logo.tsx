import Link from "next/link";
import { Flex, Heading, Box } from "@chakra-ui/react";
import Image from "next/image";
import { ROUTES } from "@/routes";
import { baseConfig } from "@/club-preset/baseConfig";

export default function Logo() {

  return (
    <Link href={ROUTES.dashboard} style={{ textDecoration: "none" }}>
      <Flex gap={2} mr={100} cursor="pointer" alignItems="center">
        <Heading as="h1" size="md" whiteSpace="nowrap">
          {baseConfig.appName}
        </Heading>
        <Box
          style={{
            width: "1.875rem",
            height: "1.75rem",
            position: "relative",
            marginRight: "1rem",
          }}
        >
          <Image
            src="/assets/common/logo-lightmode.svg"
            alt="Logo"
            fill
            style={{ objectFit: "contain", objectPosition: "left top" }}
          />
        </Box>
      </Flex>
    </Link>
  );
}
