"use client";

import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  MenuList,
  MenuButton,
  Menu,
  IconButton,
} from "@chakra-ui/react";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import type { IconType } from "react-icons";
import { FiMoreVertical } from "react-icons/fi";

export type HeaderTileProps = {
  icon: IconType;
  title: string;
  subtitle: string;
  mainColor: string;
  accentColor: string;
};

export function HeaderTile({
  icon,
  title,
  subtitle,
  mainColor,
  accentColor,
}: HeaderTileProps) {
  return (
    <Box
      minH={{ base: "auto", md: "10rem" }}
      w="full"
      maxW={{ base: "full", md: "70rem" }}
      mx="auto"
      bg="bg"
    >
      <Flex
        display={{ base: "flex", md: "none" }}
        align="center"
        justify="space-between"
        px={{ base: 3, md: 4 }}
        py={{ base: 2, md: 3 }}
      >
        <ResponsiveHeading fontSize="lg" text={title} showBar={true} />
        <Menu placement="top-end">
          <MenuButton
            as={IconButton}
            aria-label="Opcje"
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
          />
          <MenuList></MenuList>
        </Menu>
      </Flex>

      <Flex
        display={{ base: "none", md: "flex" }}
        direction={{ base: "column", md: "row" }}
        h="100%"
        w="100%"
        align="stretch"
      >
        <Flex
          direction="row"
          h={{ base: "8rem", md: "10rem" }}
          w={{ base: "100%", md: "12rem" }}
          flexShrink={0}
        >
          <Box h="100%" w={{ base: "0.75rem", md: "1rem" }} bg={accentColor} />
          <Box
            h="100%"
            flex={1}
            bg={mainColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW={0}
          >
            <Icon
              as={icon}
              color="bg"
              boxSize={{ base: "4.5rem", md: "5rem" }}
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
              {subtitle}
            </Text>
          </VStack>
        </Flex>
        <Flex padding="4">
          <Menu placement="top-end">
            <MenuButton
              as={IconButton}
              aria-label="Opcje"
              icon={<FiMoreVertical />}
              variant="ghost"
              size="sm"
            />
            <MenuList></MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}
