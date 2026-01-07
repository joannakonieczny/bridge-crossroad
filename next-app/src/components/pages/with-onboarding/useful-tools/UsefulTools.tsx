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
    <Box minH="calc(100dvh - 5rem)">
      <Flex
        direction="column"
        w="full"
        maxW={{ base: "full", lg: "75rem" }}
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 8 }}
      >
        <Box mb={{ base: 6, md: 8 }}>
          <ResponsiveHeading fontSize="3xl" text={t("title")} />
        </Box>

        <VStack spacing={{ base: 4, md: 6 }} w="full" align="stretch">
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
      </Flex>
    </Box>
  );
}
