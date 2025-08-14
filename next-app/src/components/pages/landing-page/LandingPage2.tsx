import { Box, Flex, Text } from "@chakra-ui/react";
import { FiCalendar, FiUsers, FiUserPlus } from "react-icons/fi";
import Image from "next/image";

export default function LandingPage2() {
  return (
    <Box
      bg="landingBg"
      width="100%"
      height="100vh"
      position="relative"
      overflowX="hidden"
    >
      <Box
        width="100%"
        height="90vh"
        position="absolute"
        top="50%"
        left="0"
        transform="translateY(-50%)"
      >
        <Image
          src="/assets/landing-page/landing-page-2.svg"
          alt="Logo"
          fill
          style={{
            position: "absolute",
            objectFit: "contain",
            objectPosition: "left top",
          }}
        />
        <Flex
          as="section"
          bg="purple.50"
          px={{ base: 6, md: 16 }}
          py={16}
          minH="60vh"
        >
          {/* Lewa kolumna (np. grafika lub pusta przestrzeń) */}
          <Box flex="1" />

          {/* Prawa kolumna z treścią */}
          <Flex
            flex="1"
            direction="column"
            justify="center"
            gap={8}
            maxW="500px"
          >
            {/* Nagłówek */}
            <Flex align="center" gap={2}>
              <Box w="4px" h="28px" bg="purple.400" borderRadius="full" />
              <Text fontSize="2xl" fontWeight="bold">
                Wszystko, czyli...?
              </Text>
            </Flex>

            {/* Element 1 */}
            <Flex gap={4} align="flex-start">
              <FiCalendar size={8} color="purple.400" />
              <Text>
                {/* TODO chakra ma highlight komponent */}
                <Text as="span" fontWeight="bold" color="purple.700">
                  Zaawansowany kalendarz
                </Text>
                , umożliwiający tworzenie takich wydarzeń, jak zjazdy ligowe,
                treningi, czy nawet spotkania towarzyskie!
              </Text>
            </Flex>

            {/* Element 2 */}
            <Flex gap={4} align="flex-start">
              <FiUserPlus size={8} color="purple.400" />
              <Text>
                {/* TODO chakra ma highlight komponent */}
                <Text as="span" fontWeight="bold" color="purple.700">
                  System poszukiwania partnera
                </Text>{" "}
                w oparciu o charakterystykę zawodnika i system licytacji
              </Text>
            </Flex>

            {/* Element 3 */}
            <Flex gap={4} align="flex-start">
              <FiUsers size={8} color="purple.400" />
              <Text>
                <Text as="span" fontWeight="bold" color="purple.700">
                  Możliwość tworzenia grup
                </Text>{" "}
                z miejscem na wspólne rozmowy, zapisywanie cennych rozdań czy
                materiałów szkoleniowych
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
