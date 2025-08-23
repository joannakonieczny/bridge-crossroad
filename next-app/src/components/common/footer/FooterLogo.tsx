import Link from "next/link";
import { Flex, Heading, Box } from "@chakra-ui/react";
import Image from "next/image";
import { ROUTES } from "@/routes";
import { config } from "@/club-preset/config";
import ResponsiveHeading from "../texts/ResponsiveHeading";

export default function FooterLogo() {

  return (
    <Link href={ROUTES.dashboard} style={{ textDecoration: "none" }}>
      <Flex gap={2} mr={100} cursor="pointer" alignItems="center">
        <Box
          style={{
            width: "4rem",
            height: "3.69rem",
            position: "relative",
            marginRight: "1rem",
          }}
        >
          <Image
            src="/assets/common/logo-darkmode.svg"
            alt="Logo"
            fill
            style={{ objectFit: "contain", objectPosition: "left top" }}
          />
        </Box>
        <ResponsiveHeading text={config.appName} showBar={false} fontSize="4xl" color="white"/>
      </Flex>
    </Link>
  );
}
