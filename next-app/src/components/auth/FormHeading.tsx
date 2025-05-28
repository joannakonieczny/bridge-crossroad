import { Box, BoxProps, Heading, HStack, Text } from "@chakra-ui/react";
import ChakraLink from "../chakra-config/ChakraLink";

export interface IFormHeadingProps {
  title: string;
  AccountText: string;
  AccountLink: string;
  href: string;
  onElementProps?: BoxProps;
}

export default function FormHeading(props: IFormHeadingProps) {
  return (
    <Box {...props.onElementProps}>
      <Heading fontSize="2xl" mb={4}>
        {props.title}
      </Heading>
      <HStack>
        <Text>{props.AccountText}</Text>
        <ChakraLink href={props.href} color="accent.500">
          {props.AccountLink}
        </ChakraLink>
      </HStack>
    </Box>
  );
}
