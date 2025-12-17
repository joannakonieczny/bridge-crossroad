"use client";

import { Button, Flex, useColorMode } from "@chakra-ui/react";
import Logo from "@/components/common/Logo";
import Link from "next/link";
import { useTranslations } from "@/lib/typed-translations";
import { ROUTES } from "@/routes";

export default function MinimalisticNavbar() {
  const t = useTranslations("pages.LandingPage");

  const { colorMode } = useColorMode();

  return (
    <Flex
      as="nav"
      bg={colorMode === "light" ? "bg" : "neutral.100"}
      p={4}
      boxShadow="sm"
      alignItems="center"
      position="sticky"
      top={0}
      zIndex={1000}
      pl={8}
      justify="space-between"
    >
      <Flex height={"3rem"} alignItems={"center"}>
        <Logo />
      </Flex>

      <Button colorScheme="accent" size="md" marginRight={4}>
        <Link href={ROUTES.auth.login} style={{ textDecoration: "none" }}>
          {t("logInButton")}
        </Link>
      </Button>
    </Flex>
  );
}
