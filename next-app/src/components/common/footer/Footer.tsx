import { Box, Flex } from "@chakra-ui/react";
import FooterLogo from "./FooterLogo";
import ResponsiveHeading from "../texts/ResponsiveHeading";
import ResponsiveText from "../texts/ResponsiveText";


export default function Footer() {

  return (
    <Flex
        width="100%"
        paddingX="6rem"
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
        >
          <Flex
            direction="column"
            gap="1.5rem"
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
          >
            <ResponsiveHeading text="Społeczność" fontSize="xl" color="white"/>
            <ResponsiveText color="white">
              email: justbridgeagh@gmail.com
            </ResponsiveText>
          </Flex>
        </Flex>
    </Flex>
  );
}
