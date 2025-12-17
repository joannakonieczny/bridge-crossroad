"use client";

import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { Box, Flex, Button, Highlight, Link } from "@chakra-ui/react";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import Landing1SVG from "@/assets/landing-page/landing-page-1.svg";
import { useTranslations } from "@/lib/typed-translations";
import { ROUTES } from "@/routes";

export default function LandingPage1() {
  const t = useTranslations("pages.LandingPage.landingPage1");

  return (
    <Box
      as="section"
      width="100%"
      minHeight="100vh"
      position="relative"
      overflow="hidden"
      bgColor="bg"
    >
      <ChakraSVG
        svg={Landing1SVG}
        position="absolute"
        width="100%"
        aria-label="Landing background"
        bottom="4.5rem"
        _after={{
          //for extending the svg
          backgroundColor: "landingBg",
          content: '" "',
          position: "absolute",
          width: "100%",
          height: "4.6rem",
          marginTop: "-1px",
        }}
      />
      <Flex
        direction="column"
        align="flex-start"
        gap={4}
        p={{ base: 16, sm: 32 }}
        maxW="700px"
        position="absolute"
        alignItems={{ base: "center", sm: "initial" }}
      >
        <Box>
          <ResponsiveHeading
            fontSize="3xl"
            text={t("heading")}
            marginBottom={"1.5rem"}
          />
          <ResponsiveText fontSize="lg">
            <Highlight
              query={t("highlight")}
              styles={{ color: "orange.600", fontWeight: "medium" }}
            >
              {t("text")}
            </Highlight>
          </ResponsiveText>
        </Box>
        <Button
          as={Link}
          href={ROUTES.auth.register}
          bg="accent.500"
          color="bg"
          _hover={{ bg: "accent.600", textDecoration: "none" }}
          borderRadius="md"
          px={6}
          mt={"4rem"}
          size="lg"
          maxWidth="300px"
        >
          {t("callToActionButton")}
        </Button>
      </Flex>
    </Box>
  );
}
