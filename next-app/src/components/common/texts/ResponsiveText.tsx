import { Text } from "@chakra-ui/react";
import { getResponsiveFontSizes } from "@/components/chakra-config/responsive-font-size";
import type { TextProps } from "@chakra-ui/react";
import type { FontSizeToken } from "@/components/chakra-config/responsive-font-size";

export type IResponsiveTextProps = TextProps & {
  href?: string;
  fontSize?: FontSizeToken;
};

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
