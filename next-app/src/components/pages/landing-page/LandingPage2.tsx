"use client";

import { Box, Flex, Text, Icon, Highlight } from "@chakra-ui/react";
import { FiCalendar, FiUsers, FiUserPlus } from "react-icons/fi";
import Image from "next/image";
import { BsCalendar } from "react-icons/bs";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";

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
        <Box
          position="absolute"
          display={{ base: "none", lg: "block" }}
          w="100%" 
          h="100%"
        >
          <Image
            src="/assets/landing-page/landing-page-2.svg"
            alt="Logo"
            fill
            style={{
              objectFit: "contain",
              objectPosition: "left top",
            }}
          />
        </Box>
        <Flex
          as="section"
          px={{ base: 6, md: 16 }}
          py={16}
          minH="60vh"
          backgroundColor="transparent"
          fontSize="lg"
          textAlign="justify"
          justifyContent={{base: "center", lg: "initial"}}
        >
          <Box
            flex="1"
            display={{ base: "none", lg: "block" }}
          />

          {/* Prawa kolumna z treścią */}
          <Flex
            flex="1"
            direction="column"
            justify="center"
            gap={16}
            maxW="500px"
          >
            {/* Nagłówek */}
            <ResponsiveHeading text="Wszystko, czyli...?" fontSize="3xl" />

            {/* Element 1 */}
            <Flex gap={4} align="flex-start">
              <Icon as={BsCalendar} boxSize="4rem" color="purple.400" />
              <ResponsiveText fontSize="lg">
                <Highlight
                  query="Zaawansowany kalendarz"
                  styles={{ fontWeight: "bold", color: "purple.700" }}
                >
                  Zaawansowany kalendarz, umożliwiający tworzenie takich wydarzeń, jak zjazdy ligowe, treningi, czy nawet spotkania towarzyskie!
                </Highlight>
              </ResponsiveText>
            </Flex>

            {/* Element 2 */}
            <Flex gap={4} align="flex-start">
              <Icon as={FiUserPlus} boxSize="4rem" color="purple.400" />
              <ResponsiveText fontSize="lg">
                <Highlight
                  query="System poszukiwania partnera"
                  styles={{ fontWeight: "bold", color: "purple.700" }}
                >
                  System poszukiwania partnera w oparciu o charakterystykę zawodnika i system licytacji
                </Highlight>
              </ResponsiveText>
            </Flex>

            {/* Element 3 */}
            <Flex gap={4} align="flex-start">
              <Icon as={FiUsers} boxSize="4rem" color="purple.400" />
              <ResponsiveText fontSize="lg">
                <Highlight
                  query="Możliwość tworzenia grup"
                  styles={{ fontWeight: "bold", color: "purple.700" }}
                >
                  Możliwość tworzenia grup z miejscem na wspólne rozmowy, zapisywanie cennych rozdań czy materiałów szkoleniowych
                </Highlight>
              </ResponsiveText>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
