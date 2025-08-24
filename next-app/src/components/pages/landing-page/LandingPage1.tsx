import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { Box, Flex, Button, Highlight } from "@chakra-ui/react";
import Image from "next/image";

export default function LandingPage1() {
  return (
    <Box width="100%" height="100vh" position="relative" overflow="hidden">
      {/* Tło */}
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
      <Box width="100%" height="4.5rem" backgroundColor="landingBg" bottom="0" position="absolute">

      </Box>

      {/* Kolumna tekstu */}
      <Flex
        direction="column"
        align="flex-start"
        gap={4}
        p={{base: 16, sm: 32}}
        maxW="700px"
        position="absolute"
        alignItems={{base: "center", sm: "initial"}}
      >
        {/* Nagłówek */}
        <Box>
          <ResponsiveHeading fontSize="3xl" text="Jedyny portal w Polsce" marginBottom={"1.5rem"}/>

          {/* Podtytuł */}
          <ResponsiveText fontSize="lg">
            zapewniający wszystko, czego potrzebuje Twój{" "}
            <Highlight
              query="klub brydżowy"
              styles={{ color: "orange.600", fontWeight: "medium" }}
            >
              klub brydżowy
            </Highlight>
          </ResponsiveText> 
        </Box>

        {/* Button */}
        <Button
          bg="purple.500"
          color="white"
          _hover={{ bg: "purple.600" }}
          borderRadius="md"
          px={6}
          mt={{base: "25rem", sm: "20rem"}}
          size="lg"
          maxWidth="300px"
        >
          Załóż konto teraz
        </Button>
      </Flex>
    </Box>
  );
}
