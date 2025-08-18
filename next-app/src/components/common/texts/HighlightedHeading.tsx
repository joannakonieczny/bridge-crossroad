import { Box, Flex, Text } from "@chakra-ui/react";

export type IHighlightedHeadingProps = {
  text: string;
  fontSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" 
};

export default function HighlightedHeading(props: IHighlightedHeadingProps) {
  return (
    <Flex gap={2} alignItems="stretch">
        <Box w="6px" bg="purple.400" />
        <Text fontSize={props.fontSize} fontWeight="bold">
        {props.text}
        </Text>
    </Flex>
  );
}
