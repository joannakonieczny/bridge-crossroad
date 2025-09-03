"use client";

import { Box, Flex, Icon, Highlight } from "@chakra-ui/react";
import { FiUsers, FiUserPlus } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { ChakraSVG } from "@/components/chakra-config/ChakraSVG";
import Landing2SVG from "@/assets/landing-page/landing-page-2.svg";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { useTranslations } from "@/lib/typed-translations";

export default function LandingPage2() {
  const t = useTranslations("pages.LandingPage.landingPage2");

  return (
    <Box
      as="section"
      bg="landingBg"
      w="100%"
      minHeight="100vh"
      position="relative"
      overflowX="hidden"
    >
      {/* background */}
      <ChakraSVG
        svg={Landing2SVG}
        position="absolute"
        height="100%"
        aria-label="Landing artwork"
        display={{ base: "none", lg: "block" }}
      />

      {/* Zawartość */}
      <Flex
        px={{ base: 6, md: 16 }}
        py={16}
        minH="60vh"
        justify={{ base: "center", lg: "flex-end" }}
        position="relative"
      >
        <Flex
          direction="column"
          justify="center"
          gap={12}
          maxW="500px"
          flex="1"
        >
          {/* Nagłówek */}
          <ResponsiveHeading text={t("heading")} fontSize="3xl" />

          {/* Element 1 */}
          <Flex gap={4} align="flex-start">
            <Icon as={BsCalendar} boxSize="3rem" color="accent.400" />
            <ResponsiveText fontSize="lg">
              <Highlight
                query={t("highlight1")}
                styles={{ fontWeight: "bold", color: "accent.700" }}
              >
                {t("text1")}
              </Highlight>
            </ResponsiveText>
          </Flex>

          {/* Element 2 */}
          <Flex gap={4} align="flex-start">
            <Icon as={FiUserPlus} boxSize="3rem" color="accent.400" />
            <ResponsiveText fontSize="lg">
              <Highlight
                query={t("highlight2")}
                styles={{ fontWeight: "bold", color: "accent.700" }}
              >
                {t("text2")}
              </Highlight>
            </ResponsiveText>
          </Flex>

          {/* Element 3 */}
          <Flex gap={4} align="flex-start">
            <Icon as={FiUsers} boxSize="3rem" color="accent.400" />
            <ResponsiveText fontSize="lg">
              <Highlight
                query={t("highlight3")}
                styles={{ fontWeight: "bold", color: "accent.700" }}
              >
                {t("text3")}
              </Highlight>
            </ResponsiveText>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
