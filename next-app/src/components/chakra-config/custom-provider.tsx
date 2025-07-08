"use client";

import { theme } from "@/components/chakra-config/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import SafeHydration from "../util/SafeHydration";
// import { CacheProvider } from "@chakra-ui/next-js";

export default function CustomChakraProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // <CacheProvider>
    <SafeHydration>
      <ChakraProvider theme={theme}>
        {/* render after mount */}
        {children}
      </ChakraProvider>
    </SafeHydration>
    // </CacheProvider>
  );
}
