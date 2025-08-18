import HighlightedHeading from "@/components/common/texts/HighlightedHeading";
import { Box, Flex, Text, Button, Highlight } from "@chakra-ui/react";
import Image from "next/image";

export default function LandingPage1() {
  return (
    <Box width="100%" height="100vh" position="relative" overflow="hidden">
      <Image
        src="/assets/landing-page/landing-page-1.svg"
        alt="Logo"
        fill
        style={{
          position: "absolute",
          objectFit: "cover",
          objectPosition: "left bottom"
        }}
      />
      <Flex direction="column" align="flex-start" gap={4} p={32} maxW="700px" position="absolute">
        {/* Header */}
        <HighlightedHeading fontSize="3xl" text="Jedyny portal w Polsce"/>

        {/* Subtitle */}
        <Text fontSize="lg">zapewniający wszystko, czego potrzebuje</Text>

        {/* Highlighted text */}
        <Text fontSize="lg">
          <Highlight query="klub brydżowy" styles={{color: "orange.600", fontWeight: "medium"}}>
            Twój klub brydżowy
          </Highlight>
        </Text>

        {/* Button */}
        {/* TODO mamy chb generyczny? */}
        <Button
          bg="purple.500"
          color="white"
          _hover={{ bg: "purple.600" }}
          borderRadius="md"
          px={6}
          mt="20rem"
          size="lg"
        >
          Załóż konto teraz
        </Button>
      </Flex>
    </Box>
  );
}
