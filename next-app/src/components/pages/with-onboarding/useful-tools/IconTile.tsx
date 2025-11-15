"use client";

import { Box, Flex, Text, Button, Icon, VStack, Link } from "@chakra-ui/react";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import { FaGreaterThan } from "react-icons/fa";
import type { IconType } from "react-icons";
import type { ToolName } from "@/club-preset/useful-tools";

export type TileProps = {
  icon: IconType;
  link: string;
  toolName: ToolName;
  title: string;
  description: string;
  buttonText: string;
  isPrimaryVariant: boolean;
};

export function Tile({
  icon,
  link,
  title,
  description,
  buttonText,
  isPrimaryVariant,
}: TileProps) {
  return (
    <Box
      minH={{ base: "auto", md: "13rem" }}
      w="full"
      maxW={{ base: "full", md: "70rem" }}
      mx="auto"
      bg="bg"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        h="100%"
        w="100%"
        align="stretch"
      >
        <Flex
          direction="row"
          h={{ base: "8rem", md: "13rem" }}
          w={{ base: "100%", md: "15rem" }}
          flexShrink={0}
        >
          <Box
            h="100%"
            w={{ base: "0.75rem", md: "1rem" }}
            bg={isPrimaryVariant ? "accent.100" : "secondary.100"}
          />
          <Box
            h="100%"
            flex={1}
            bg={isPrimaryVariant ? "border.500" : "secondary.500"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW={0}
          >
            <Icon
              as={icon}
              color="bg"
              boxSize={{ base: "4.5rem", md: "8rem" }}
            />
          </Box>
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          flex={1}
          p={4}
          gap={3}
          minW={0}
        >
          <VStack align="start" spacing={3} w="100%">
            <ResponsiveHeading fontSize="xl" text={title} showBar={false} />
            <Box h="2px" w="100%" maxW="50rem" bg="accent.200" />
            <Text fontSize={{ base: "xs", md: "sm" }} wordBreak="break-word">
              {description}
            </Text>
          </VStack>
        </Flex>
        <Flex
          p={4}
          alignItems="flex-end"
          justifyContent="flex-end"
          flexShrink={0}
        >
          <Link href={link} isExternal>
            <Button
              color="accent.500"
              fontSize={{ base: "xs", md: "sm" }}
              bgColor="bg"
              borderColor="accent.500"
              borderWidth="0.125rem"
              rightIcon={<FaGreaterThan />}
            >
              {buttonText}
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
