import { Text } from "@chakra-ui/react";
import type { TextProps } from "@chakra-ui/react";

export type IResponsiveTextProps = TextProps & {
  href?: string;
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
};

const fontSizesOrder = ["sm", "md", "lg", "xl", "2xl", "3xl"];

function getResponsiveFontSizes(size: string) {
  const index = fontSizesOrder.indexOf(size);
  if (index === -1) return { base: size }; // fallback
  const baseIndex = Math.max(index - 2, 0); // base → 2 poziomy mniejsze
  const mdIndex = Math.max(index - 1, 0);   // md → 1 poziom mniejsze
  const lgIndex = index;                    // lg → oryginalny rozmiar
  return {
    base: fontSizesOrder[baseIndex],
    md: fontSizesOrder[mdIndex],
    lg: fontSizesOrder[lgIndex],
  };
}

export default function ResponsiveText({
  href,
  fontSize = "md",
  textAlign = "left",
  children,
  ...rest
}: IResponsiveTextProps) {
  const responsiveFontSize = getResponsiveFontSizes(fontSize);

  return (
    <Text
      as={href ? "a" : "p"}
      href={href}
      fontSize={responsiveFontSize}
      textAlign={textAlign}
      {...rest}
    >
      {children}
    </Text>
  );
}
