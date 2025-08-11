import { Box, HStack, Stack, Text, Image } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useTranslations } from "@/lib/typed-translations";

export default function FormLayout({ children }: { children?: ReactNode }) {
  const t = useTranslations("common");
  return (
    <Stack mb={8}>
      {/* Logo and appName */}
      <HStack justify="space-between">
        <HStack>
          <Box w="8px" h="80px" bg="accent.500" borderRadius="2px" />
          <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
            {t("appNameWords.first")} <br /> {t("appNameWords.second")}
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
