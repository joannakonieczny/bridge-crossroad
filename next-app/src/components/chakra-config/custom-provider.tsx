"use client";

import { theme } from "@/components/chakra-config/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import SafeHydration from "../common/SafeHydration";

export default function CustomChakraProvider({ children }: PropsWithChildren) {
  return (
    <SafeHydration>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </SafeHydration>
  );
}
