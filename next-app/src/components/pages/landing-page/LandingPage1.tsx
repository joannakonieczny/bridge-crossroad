import { Box, Flex, Text, Button } from "@chakra-ui/react";
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
          objectFit: "none",
          objectPosition: "left -9rem",
        }}
      />
      <Flex direction="column" align="flex-start" gap={4} p={8} maxW="500px">
        {/* Header */}
        <Flex gap={2}>
          {/* TODO zakladam ze to jakas linia, chakra ma od tego komponent */}
          <Box w="4px" h="24px" bg="purple.400" borderRadius="full" />
          <Text fontSize="2xl" fontWeight="bold">
            Jedyny portal w Polsce
          </Text>
        </Flex>

        {/* Subtitle */}
        <Text fontSize="md">zapewniający wszystko, czego potrzebuje</Text>

        {/* Highlighted text */}
        {/* TODO chakra ma highlight komponent */}
        <Text fontSize="md">
          Twój{" "}
          <Text as="span" color="orange.600" fontWeight="medium">
            klub brydżowy
          </Text>
        </Text>

        {/* Button */}
        {/* TODO mamy chb generyczny? */}
        <Button
          bg="purple.500"
          color="white"
          _hover={{ bg: "purple.600" }}
          borderRadius="md"
          px={6}
        >
          Załóż konto teraz
        </Button>
      </Flex>
    </Box>
  );
}
