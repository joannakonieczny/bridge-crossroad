"use server";

import { getMessage } from "@/repositories/chat-messages";
import { RepositoryError } from "@/repositories/common";
import type { ChatMessageIdType } from "@/schemas/model/chat-message/chat-message-types";
import type { UserIdType } from "@/schemas/model/user/user-types";

type RequireChatMessageAccessParams = {
  chatMessageId: ChatMessageIdType;
  userId: UserIdType;
};

export async function requireChatMessageAccess({
  chatMessageId,
  userId,
}: RequireChatMessageAccessParams) {
  const chatMessage = await getMessage(chatMessageId);
  if (chatMessage.senderId.toString() !== userId) {
    throw new RepositoryError("Access denied to chat message");
  }
}
