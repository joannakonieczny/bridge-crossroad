"use client";

import { Flex, Divider, Box } from "@chakra-ui/react";
import { TextInput } from "./TextInput";
import { ChatBox } from "./ChatBox";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { MessageWithPopulatedSenderType } from "@/schemas/model/chat-message/chat-message-types";
import { useState } from "react";

type IChatViewProps = {
  groupId: GroupIdType;
};

export default function ChatView(props: IChatViewProps) {
  const [editingMessage, setEditingMessage] =
    useState<MessageWithPopulatedSenderType | null>(null);

  const handleEditMessage = (message: MessageWithPopulatedSenderType) => {
    setEditingMessage(message);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  return (
    <Flex
      backgroundColor="border.50"
      width="100%"
      h={{ base: "calc(100vh - 7rem)", md: "calc(100vh - 5rem)" }}
      paddingY={{ base: "1rem", md: "2rem" }}
      paddingX={{ base: "1rem", md: "3rem" }}
      gap="1.25rem"
      overflow="hidden"
      direction="column"
      alignContent="center"
    >
      <ChatBox groupId={props.groupId} onEditMessage={handleEditMessage} />
      <Box>
        <Divider flexShrink={0} />
        <TextInput
          groupId={props.groupId}
          editingMessage={editingMessage}
          onCancelEdit={handleCancelEdit}
        />
      </Box>
    </Flex>
  );
}
