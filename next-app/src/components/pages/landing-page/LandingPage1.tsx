import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { Box, Flex, Button, Highlight, Link } from "@chakra-ui/react";
import Image from "next/image";
import { useTranslations } from "@/lib/typed-translations";
import { ROUTES } from "@/routes";

export default function LandingPage1() {
  const t = useTranslations("pages.LandingPage.landingPage1");

  return (
    <Box width="100%" height="100vh" position="relative" overflow="hidden">
      <Image
        src="/assets/landing-page/landing-page-1.svg"
        alt="Logo"
        fill
        style={{
          position: "absolute",
          objectFit: "cover",
          objectPosition: "left -4.5rem",
        }}
      />
      <Box
        width="100%"
        height="4.5rem"
        backgroundColor="landingBg"
        bottom="0"
        position="absolute"
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
          bg="purple.500"
          color="white"
          _hover={{ bg: "purple.600", textDecoration: "none" }}
          borderRadius="md"
          px={6}
          mt={{ base: "25rem", sm: "20rem" }}
          size="lg"
          maxWidth="300px"
        >
          {t("callToActionButton")}
        </Button>
      </Flex>
    </Box>
  );
}
