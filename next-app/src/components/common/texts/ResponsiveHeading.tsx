import { Box, Flex, Text } from "@chakra-ui/react";
import type { FlexProps } from "@chakra-ui/react";

export type IResponsiveHeadingProps = FlexProps & {
  text: string;
  showBar?: boolean;
  fontSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  textAlign?: 
    | "left" 
    | "right" 
    | "center" 
    | "justify" 
    | "start" 
    | "end";
  justifyContent?: 
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'stretch';
};

const fontSizesOrder = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

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
      {showBar && <Box w="6px" bg="purple.400" />}
      <Text fontSize={responsiveFontSize} fontWeight="bold">
        {text}
      </Text>
    </Flex>
  );
}
