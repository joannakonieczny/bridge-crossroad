import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { Box, Flex, Highlight } from "@chakra-ui/react";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import Landing3UpperArrowSVG from "@/assets/landing-page/landing-page-3.svg";
import Landing3ArtSVG from "@/assets/landing-page/landing-page-3-art.svg";
import { useTranslations } from "@/lib/typed-translations";

export default function LandingPage3() {
  const t = useTranslations("pages.LandingPage.landingPage3");

  return (
    <Box
      as="section"
      bg="secondary.100"
      w="100%"
      minHeight="100vh"
      position="relative"
      overflowX="hidden"
    >
      {/* upper arrow */}
      <ChakraSVG
        svg={Landing3UpperArrowSVG}
        position="absolute"
        width="100%"
        aria-label="Tło sekcji 3"
      />

      {/* Teksty */}
      <Flex
        direction="column"
        textAlign="center"
        justify="center"
        gap="1.5rem"
        mt="6rem"
        align="center"
      >
        <Flex direction="column" align="center">
          <ResponsiveHeading
            text={t("heading")}
            fontSize="3xl"
            textAlign="center"
            mb="1.5rem"
          />
          <ResponsiveText
            fontSize="lg"
            maxW="20rem"
            w="100%"
            textAlign="center"
          >
            <Highlight query={t("highlight")} styles={{ fontWeight: "bold" }}>
              {t("text")}
            </Highlight>
          </ResponsiveText>
        </Flex>

        {/* Grafika */}
        <ChakraSVG
          svg={Landing3ArtSVG}
          width="20rem"
          height="auto"
          aria-label="Ilustracja sekcji 3"
        />
      </Flex>
    </Box>
  );
}
