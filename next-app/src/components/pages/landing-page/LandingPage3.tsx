import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { Box, Flex, Highlight } from "@chakra-ui/react";
import Image from "next/image";
import { useTranslations } from "@/lib/typed-translations";

export default function LandingPage3() {
  const t = useTranslations("pages.LandingPage.landingPage3");

  return (
    <Box
      bg="yellow.100"
      w="100%"
      h="100vh"
      position="relative"
      overflowX="hidden"
    >
      <Flex
        w="100%"
        h="100vh"
        position="absolute"
        top="50%"
        left="0"
        transform="translateY(-50%)"
        justify="center"
        align="center"
      >
        {/* Tło */}
        <Image
          src="/assets/landing-page/landing-page-3.svg"
          alt="Tło sekcji 3"
          fill
          style={{
            position: "absolute",
            objectFit: "contain",
            objectPosition: "right top",
            margin: "-1px", // special case trick - the svg didn't align properly
          }}
          priority
        />

        {/* Teksty */}
        <Flex
          direction="column"
          textAlign="center"
          justify="center"
          gap="1.5rem"
          mt="3rem"
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
              <Highlight
                query={t("highlight")}
                styles={{ fontWeight: "bold" }}
              >
                {t("text")}
              </Highlight>
            </ResponsiveText>
          </Flex>

          {/* Grafika */}
          <Image
            src="/assets/landing-page/landing-page-3-art.svg"
            alt="Ilustracja sekcji 3"
            width={27 * 16}
            height={37.7 * 16}
            style={{
              width: "20rem",
              height: "auto",
              objectFit: "contain",
              objectPosition: "right top",
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
