import { Box, HStack, Stack, Text, Image } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { config } from "@/club-preset/baseConfig";

export default function FormLayout({ children }: PropsWithChildren) {
  const [firstWord, secondWord] = config.appName.split(" ");
  return (
    <Stack mb={8}>
      {/* Logo and appName */}
      <HStack justify="space-between">
        <HStack>
          <Box w="8px" h="80px" bg="accent.500" borderRadius="2px" />
          <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
            {firstWord} <br /> {secondWord}
          </Text>
        </HStack>
        <Image
          src="/assets/common/logo-lightmode.svg"
          alt="logo"
          objectFit="cover"
          objectPosition="right"
          h="100px"
        />
      </HStack>

      {children}
    </Stack>
  );
}
