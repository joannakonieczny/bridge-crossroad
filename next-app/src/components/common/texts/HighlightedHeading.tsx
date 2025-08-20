import { Box, Flex, Text } from "@chakra-ui/react";

export type IHighlightedHeadingProps = {
  text: string;
  fontSize: 
    "sm" 
  | "md" 
  | "lg" 
  | "xl" 
  | "2xl" 
  | "3xl"
  textAlign?: 
    "left" 
  | "right" 
  | "center" 
  | "justify" 
  | "start" 
  | "end";
  justifyContent?: 
    'flex-start'
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

export default function HighlightedHeading(props: IHighlightedHeadingProps) {
  return (
    <Flex gap={2} alignItems="stretch" textAlign={props.textAlign || "left"} justifyContent={props.justifyContent || "left"}>
        <Box w="6px" bg="purple.400" />
        <Text fontSize={props.fontSize} fontWeight="bold">
        {props.text}
        </Text>
    </Flex>
  );
}
