"use client";

import { theme } from "@/components/chakra-config/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import SafeHydration from "../util/SafeHydration";

export default function CustomChakraProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SafeHydration>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </SafeHydration>
  );
}
