"use client";

import type { UserTypeBasic } from "@/schemas/model/user/user-types";
import { getPersonLabel } from "@/util/formatters";
import { Box, Text, Flex } from "@chakra-ui/react";

type IMessageBoxProps = {
  timestamp: Date;
  content: string;
  sender: UserTypeBasic;
  isAdmin: boolean;
  isSelf: boolean;
};

export default function MessageBox(props: IMessageBoxProps) {
  const messageBoxColor = props.isSelf
    ? "accent.500"
    : props.isAdmin
    ? "secondary.200"
    : "border.100";
  const messageFontColor = props.isSelf ? "bg" : "fonts.default";

  return (
    <Box
      w="100%"
      display="flex"
      justifyContent={props.isSelf ? "flex-end" : "flex-start"}
      p="0.5rem"
    >
      <Flex
        direction="column"
        alignItems={props.isSelf ? "flex-end" : "flex-start"}
      >
        <Text
          fontSize="xs"
          color="border.500"
          marginBottom="0.25rem"
          textAlign={props.isSelf ? "right" : "left"}
        >
          {!props.isSelf ? getPersonLabel(props.sender) : ""}
        </Text>
        <Flex
          alignItems="flex-end"
          gap={0}
          flexDirection={props.isSelf ? "row-reverse" : "row"}
          width="fit-content"
          maxW="60%"
          minW={{ base: "6ch", md: "10ch" }}
        >
          <Flex flexDirection="column" gap="0">
            <Box
              backgroundColor={messageBoxColor}
              padding="0.5rem 1rem"
              borderRadius="0.5rem"
              minW={{ base: "6ch", md: "10ch" }}
            >
              <Text
                wordBreak="normal"
                whiteSpace="normal"
                color={messageFontColor}
              >
                {props.content}
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
