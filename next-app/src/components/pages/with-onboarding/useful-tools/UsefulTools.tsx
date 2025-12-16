"use client";

import { Box, Flex, VStack } from "@chakra-ui/react";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import { useTranslations } from "@/lib/typed-translations";
import { tools } from "@/club-preset/useful-tools";
import type { ToolName } from "@/club-preset/useful-tools";
import { Tile } from "@/components/pages/with-onboarding/useful-tools/IconTile";

export default function UsefulTools() {
  const t = useTranslations("pages.UsefulTools");

  return (
    <Box bg="neutral.50">
      <Flex
        justify="center"
        w="full"
        minH="calc(100dvh - 5rem)"
        px={{ base: 4, md: 8 }}
      >
        <VStack spacing={{ base: "1.25rem", md: "2rem" }}>
          <Box
            bg="bg"
            w="full"
            maxW={{ base: "full", md: "70rem" }}
            mx="auto"
            mt={{ base: "2rem", md: "3rem" }}
            display="flex"
            alignItems="center"
          >
            <ResponsiveHeading fontSize="3xl" text={t("title")} />
          </Box>
          <VStack
            spacing={{ base: "1rem", md: "2rem" }}
            mb={{ base: "1rem", md: "2rem" }}
            w="full"
            align="center"
          >
            {Object.entries(tools).map(([Tool, { icon, link }], i) => {
              const toolName = Tool as ToolName;
              return (
                <Tile
                  key={Tool}
                  icon={icon}
                  link={link}
                  toolName={toolName}
                  isPrimaryVariant={i % 2 === 0}
                  title={t(`tools.${toolName}.title`)}
                  description={t(`tools.${toolName}.description`)}
                  buttonText={t("buttonText")}
                />
              );
            })}
          </VStack>
        </VStack>
      </Flex>
    </Box>
  );
}
