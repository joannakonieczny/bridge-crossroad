import { getResponsiveFontSizes } from "@/components/chakra-config/responsive-font-size";
import { Box, Flex, Text } from "@chakra-ui/react";
import type { FlexProps } from "@chakra-ui/react";
import type { FontSizeToken } from "@/components/chakra-config/responsive-font-size";

export type IResponsiveHeadingProps = FlexProps & {
  text: string;
  fontSize: FontSizeToken;
  showBar?: boolean;
};

export default function ResponsiveHeading({
  text,
  showBar = true,
  fontSize,
  textAlign = "left",
  justifyContent = "left",
  ...rest
}: IResponsiveHeadingProps) {
  const responsiveFontSize = getResponsiveFontSizes(fontSize);

  return (
    <Flex
      gap={2}
      alignItems="stretch"
      textAlign={textAlign}
      justifyContent={justifyContent}
      {...rest}
    >
      {showBar && <Box w="6px" bg="accent.400" />}
      <Text fontSize={responsiveFontSize} fontWeight="bold">
        {text}
      </Text>
    </Flex>
  );
}
