"use client";

import { Box, Flex, Text, Button, Icon, Link } from "@chakra-ui/react";
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
      w="full"
      maxW={{ base: "full", md: "70rem" }}
      mx="auto"
      bg="bg"
      borderRadius="xl"
      borderWidth="1px"
      overflow="hidden"
    >
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 6 }}>
        {/* ICON SECTION */}
        <Flex
          w={{ base: "100%", md: "12rem", lg: "14rem" }}
          h={{ base: "10rem", md: "12rem" }}
          borderRadius="lg"
          overflow="hidden"
          flexShrink={0}
        >
          <Box w="4px" bg="accent.500" />
          <Box
            flex={1}
            bg={isPrimaryVariant ? "border.500" : "secondary.500"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={icon} color="bg" boxSize={{ base: "4rem", md: "6rem" }} />
          </Box>
        </Flex>

        {/* CONTENT SECTION */}
        <Flex
          direction="column"
          flex={1}
          minW={0}
          p={{ base: 4, md: 6 }}
          pt={{ base: 0, md: 6 }}
        >
          <ResponsiveHeading fontSize="xl" text={title} showBar={false} />

          <Text color="muted" mt={2} noOfLines={{ base: 4, md: 3 }}>
            {description}
          </Text>

          <Flex mt={4} justify="flex-end">
            <Link href={link} isExternal>
              <Button
                size={{ base: "sm", md: "md" }}
                colorScheme="accent"
                variant="outline"
                rightIcon={<FaGreaterThan size="0.8em" />}
              >
                {buttonText}
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
