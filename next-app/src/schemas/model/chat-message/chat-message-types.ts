import type { z } from "zod";
import type { UserTypeBasic } from "../user/user-types";
import type * as s from "./chat-message-schema";

export type MessageType = z.infer<typeof s.messageSchema>;
export type ChatMessageSchemaType = z.infer<typeof s.chatMessageSchema>;

export type ChatMessageIdType = string;

export type MessageWithPopulatedSenderType = Omit<
  ChatMessageSchemaType,
  "senderId"
> & {
  sender: UserTypeBasic & {
    isCurrentUser?: boolean;
    isGroupAdmin?: boolean;
  };
};

export type MessageWithPopulatedSenderTypeWithoutMessage = Omit<
  MessageWithPopulatedSenderType,
  "message"
>;
