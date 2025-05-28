"use client";

import { theme } from "@/components/chakra-config/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import SafeHydration from "../util/SafeHydration";

// export default function CustomChakraProvider({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <ChakraDefaultProvider theme={theme}>{children}</ChakraDefaultProvider>
//   );
// }

// export default function CustomChakraProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     // <ThemeProvider attribute="class" disableTransitionOnChange>
//     <ChakraProvider theme={theme}>{children}</ChakraProvider>
//     // </ThemeProvider>
//   );
// }

// export default function CustomChakraProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       <ColorModeScript initialColorMode={theme.config.initialColorMode} />
//       <ChakraProvider theme={theme}>{children}</ChakraProvider>
//     </>
//   );
// }

// export default function CustomChakraProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ThemeProvider
//       attribute="class"
//       defaultTheme={theme.config.initialColorMode}
//       disableTransitionOnChange
//     >
//       <ColorModeScript initialColorMode={theme.config.initialColorMode} />
//       <ChakraProvider theme={theme}>{children}</ChakraProvider>
//     </ThemeProvider>
//   );
// }

export default function CustomChakraProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider>
      <SafeHydration>
        <ChakraProvider theme={theme}>
          {/* render after mount */}
          {children}
        </ChakraProvider>
      </SafeHydration>
    </CacheProvider>
  );
}
