import { getResponsiveFontSizes } from "@/components/chakra-config/responsive-font-size";
import { Box, Flex, Text } from "@chakra-ui/react";
import type { FlexProps } from "@chakra-ui/react";
import type { FontSizeToken } from "@/components/chakra-config/responsive-font-size";

export type IResponsiveHeadingProps = FlexProps & {
  text: string;
  fontSize: FontSizeToken;
  showBar?: boolean;
  barOrientation?: "vertical" | "horizontal";
};

export default function ResponsiveHeading({
  text,
  showBar = true,
  barOrientation = "vertical",
  fontSize,
  textAlign = "left",
  justifyContent = "left",
  ...rest
}: IResponsiveHeadingProps) {
  const responsiveFontSize = getResponsiveFontSizes(fontSize);

  // Wariant horizontal 
  if (barOrientation === "horizontal") {
    return (
      <Flex direction="column" align="flex-start" pb={5}>
      <Box
        fontSize={responsiveFontSize}
        fontWeight="bold"
        position="relative"
        display="inline-block"
      >
        {text}
        <Box
          position="absolute"
          bottom={-1}
          left={0}
          height="2px"
          width="100%"
          bg="accent.300"
          transform="scaleX(1.2)"
          transformOrigin="left"
        />
      </Box>
    </Flex>
    );
  }

  // Wariant vertical
  return (
    <Flex
      gap={2}
      alignItems="stretch"
      textAlign={textAlign}
      justifyContent={justifyContent}
      direction="row"
      {...rest}
    >
      {showBar && <Box w="6px" bg="accent.400" />}
      <Text fontSize={responsiveFontSize} fontWeight="bold">
        {text}
      </Text>
    </Flex>
  );
}
