import { Box, Flex } from "@chakra-ui/react";
import FooterLogo from "./FooterLogo";
import ResponsiveHeading from "../texts/ResponsiveHeading";
import ResponsiveText from "../texts/ResponsiveText";
import { baseConfig } from "@/club-preset/baseConfig";
import { BsFacebook } from "react-icons/bs";
import { FaInstagramSquare, FaYoutube } from "react-icons/fa";
import ChakraLink from "@/components/chakra-config/ChakraLink";
import { ROUTES } from "@/routes";
import { useTranslations } from "@/lib/typed-translations";

export default function Footer() {
  const t = useTranslations("components.Footer");

  return (
    <Flex
      width="100%"
      paddingX={{ base: "3rem", md: "6rem" }}
      paddingY="3rem"
      backgroundColor="accent.800"
      direction="column"
      gap="5rem"
    >
      <Box width="100%">
        <FooterLogo />
      </Box>
      <Flex
        width="100%"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "center", md: "initial" }}
        gap={{ base: "2rem", md: 0 }}
      >
        {/* Szybki dostęp */}
        <Flex
          direction="column"
          gap="1.5rem"
          width="100%"
          display={{ base: "none", md: "flex" }}
        >
          <ResponsiveHeading
            text={t("quickAccess.title")}
            fontSize="xl"
            color="white"
          />
          <ResponsiveText as={ChakraLink} href={ROUTES.dashboard} color="white">
            {t("quickAccess.content.dashboard")}
          </ResponsiveText>
          <ResponsiveText as={ChakraLink} href={ROUTES.calendar} color="white">
            {t("quickAccess.content.calendar")}
          </ResponsiveText>
          <ResponsiveText as={ChakraLink} href={ROUTES.groups} color="white">
            {t("quickAccess.content.groups")}
          </ResponsiveText>
          <ResponsiveText
            as={ChakraLink}
            href={ROUTES.find_partner}
            color="white"
          >
            {t("quickAccess.content.findPartner")}
          </ResponsiveText>
          <ResponsiveText as={ChakraLink} href={ROUTES.tools} color="white">
            {t("quickAccess.content.tools")}
          </ResponsiveText>
        </Flex>

        {/* Pomoc */}
        <Flex direction="column" gap="1.5rem" width="100%">
          <ResponsiveHeading
            text={t("help.title")}
            fontSize="xl"
            color="white"
          />
          <ResponsiveText color="white">
            {t("help.content.privacyPolice")}
          </ResponsiveText>
          <ResponsiveText color="white">
            {t("help.content.technicalHelp")}
          </ResponsiveText>
        </Flex>

        {/* Społeczność */}
        <Flex direction="column" gap="1.5rem" width="100%">
          <ResponsiveHeading
            text={t("socialMedia.title")}
            fontSize="xl"
            color="white"
          />
          <ResponsiveText color="white">
            {baseConfig.socialMedia.clubEmail}
          </ResponsiveText>
          <Flex gap="2rem">
            <ChakraLink
              href={baseConfig.socialMedia.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsFacebook size="3rem" color="white" />
            </ChakraLink>
            <ChakraLink
              href={baseConfig.socialMedia.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagramSquare size="3rem" color="white" />
            </ChakraLink>
            <ChakraLink
              href={baseConfig.socialMedia.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube size="3rem" color="white" />
            </ChakraLink>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
