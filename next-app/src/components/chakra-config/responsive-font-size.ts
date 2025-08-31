import { theme as chakraTheme } from "@chakra-ui/react";
import type { Theme } from "@chakra-ui/react";

export type FontSizeToken = keyof Theme["fontSizes"];

const fontSizesOrder = Object.keys(chakraTheme.fontSizes) as FontSizeToken[];

/**
 * Returns responsive font sizes for a given font size token.
 *
 * The function calculates three font size values for different breakpoints:
 * - `base`: Two levels smaller than the provided size.
 * - `md`: One level smaller than the provided size.
 * - `lg`: The original provided size.
 *
 * If the provided size is not found in the font size order, it falls back to using the original size for all breakpoints.
 *
 * @param size - The font size token to generate responsive sizes for.
 * @returns An object containing font sizes for `base`, `md`, and `lg` breakpoints.
 */
export function getResponsiveFontSizes(size: FontSizeToken) {
  const index = fontSizesOrder.indexOf(size);
  if (index === -1) return { base: size }; // fallback
  const baseIndex = Math.max(index - 2, 0); // base → 2 lvl smaller
  const mdIndex = Math.max(index - 1, 0); // md → 1 lvl smaller
  const lgIndex = index; // lg → original size
  return {
    base: fontSizesOrder[baseIndex],
    md: fontSizesOrder[mdIndex],
    lg: fontSizesOrder[lgIndex],
  };
}
