import { Box, Flex } from "@chakra-ui/react";
import FooterLogo from "./FooterLogo";
import ResponsiveHeading from "../texts/ResponsiveHeading";
import ResponsiveText from "../texts/ResponsiveText";
import { baseConfig } from "@/club-preset/baseConfig";
import { BsFacebook } from "react-icons/bs";
import { FaInstagramSquare, FaYoutube } from "react-icons/fa";


export default function Footer() {

  return (
    <Flex
        width="100%"
        paddingX={{base:"3rem", md: "6rem"}}
        paddingY="3rem"
        backgroundColor="purple.800"
        direction="column"
        gap="5rem"
    >
        <Box width="100%">
          <FooterLogo />
        </Box>
        <Flex
          width="100%"
          justifyContent="space-between"
          direction={{base: "column", md: "row"}}
          alignItems={{base: "center", md: "initial"}}
          gap={{base: "2rem", md: 0}}
        >
          <Flex
            direction="column"
            gap="1.5rem"
            width="100%"
            display={{base: "none", md: "block"}}
          >
            <ResponsiveHeading text="Szybki dostęp" fontSize="xl" color="white"/>
            <ResponsiveText color="white">
              Strona główna
            </ResponsiveText>
            <ResponsiveText color="white">
              Kalendarz
            </ResponsiveText>
            <ResponsiveText color="white">
              Grupy
            </ResponsiveText>
            <ResponsiveText color="white">
              Szukaj partnera
            </ResponsiveText>
            <ResponsiveText color="white">
              Przydatne narzędzia
            </ResponsiveText>
          </Flex>
          <Flex
            direction="column"
            gap="1.5rem"
            width="100%"
          >
            <ResponsiveHeading text="Pomoc" fontSize="xl" color="white"/>
            <ResponsiveText color="white">
              Polityka prywatności
            </ResponsiveText>
            <ResponsiveText color="white">
              Pomoc techniczna
            </ResponsiveText>
          </Flex>
          <Flex
            direction="column"
            gap="1.5rem"
            width="100%"
          >
            <ResponsiveHeading text="Społeczność" fontSize="xl" color="white"/>
            <ResponsiveText color="white">
              email: {baseConfig.clubEmail}
            </ResponsiveText>
            <Flex
              gap="2rem"
            >
              <BsFacebook size="3rem" color="white"/>
              <FaInstagramSquare size="3rem" color="white"/>
              <FaYoutube size="3rem" color="white"/>
            </Flex>
          </Flex>
        </Flex>
    </Flex>
  );
}
