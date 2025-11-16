"use client";

import type { MessageWithPopulatedSenderType } from "@/schemas/model/chat-message/chat-message-types";
import { getDateLabel, getPersonLabel } from "@/util/formatters";
import { Box, Text, Flex } from "@chakra-ui/react";
import { useState } from "react";

type IMessageBoxProps = {
  message: MessageWithPopulatedSenderType;
};

export default function MessageBox({ message }: IMessageBoxProps) {
  const isSelf = !!message.sender?.isCurrentUser;
  const isAdmin = !!message.sender?.isGroupAdmin;
  const sender = message.sender;
  const content = message.message;
  const [showDate, setShowDate] = useState(false);

  const messageBoxColor = isSelf
    ? "accent.500"
    : isAdmin
    ? "secondary.200"
    : "border.100";

  const messageBoxHoverColor = isSelf
    ? "accent.600"
    : isAdmin
    ? "secondary.300"
    : "border.200";

  const messageFontColor = isSelf ? "bg" : "fonts.default";

  return (
    <Box
      w="100%"
      display="flex"
      justifyContent={isSelf ? "flex-end" : "flex-start"}
      px="0.5rem"
      py="0.25rem"
    >
      <Flex direction="column" alignItems={isSelf ? "flex-end" : "flex-start"}>
        <Text
          fontSize="xs"
          color="border.500"
          marginBottom="0.25rem"
          textAlign={isSelf ? "right" : "left"}
        >
          {!isSelf && getPersonLabel(sender)}
        </Text>
        <Flex
          alignItems="flex-end"
          gap={0}
          flexDirection={isSelf ? "row-reverse" : "row"}
          width="fit-content"
          maxW="60%"
          minW={{ base: "6ch", md: "10ch" }}
        >
          <Flex flexDirection="column" gap="0">
            <Box
              backgroundColor={messageBoxColor}
              _hover={{ bg: messageBoxHoverColor }}
              padding="0.5rem 1rem"
              borderRadius="0.5rem"
              minW={{ base: "6ch", md: "10ch" }}
              onClick={() => setShowDate((s) => !s)}
              cursor="pointer"
              role="button"
            >
              <Text
                wordBreak="normal"
                whiteSpace="normal"
                color={messageFontColor}
              >
                {content}
              </Text>
            </Box>
            {showDate && (
              <Text
                fontSize="xs"
                color="border.500"
                marginTop="0.25rem"
                textAlign={isSelf ? "right" : "left"}
              >
                {getDateLabel(message.createdAt)}
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
