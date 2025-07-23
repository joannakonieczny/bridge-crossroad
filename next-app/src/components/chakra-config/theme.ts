import { extendTheme } from "@chakra-ui/react";

// https://v2.chakra-ui.com/docs/styled-system/semantic-tokens
// https://chakra-ui.com/docs/theming/theme

export const theme = extendTheme({
  config: {
    initialColorMode: "light", // default color mode
    useSystemColorMode: false,
  },
  semanticTokens: {
    colors: {
      accent: {
        50: { default: "purple.50", _dark: "blue.50" },
        100: { default: "purple.100", _dark: "blue.100" },
        200: { default: "purple.200", _dark: "blue.200" },
        300: { default: "purple.300", _dark: "blue.300" },
        400: { default: "purple.400", _dark: "blue.400" },
        500: { default: "purple.500", _dark: "blue.500" }, // main color
        600: { default: "purple.600", _dark: "blue.600" },
        700: { default: "purple.700", _dark: "blue.700" },
        800: { default: "purple.800", _dark: "blue.800" },
        900: { default: "purple.900", _dark: "blue.900" },
      },
      border: {
        50: { default: "gray.50" },
        100: { default: "gray.100" },
        200: { default: "gray.200" },
        300: { default: "gray.300" },
        400: { default: "gray.400" },
        500: { default: "gray.500" },
        600: { default: "gray.600" },
        700: { default: "gray.700" },
        800: { default: "gray.800" },
        900: { default: "gray.900" },
      },
      landingBg: {
        default: "#D5D5FF"
      }
    },
  },
  components: {},
  fonts: {
    heading: "var(--font-montserrat)",
    body: "var(--font-montserrat)",
  },
});
