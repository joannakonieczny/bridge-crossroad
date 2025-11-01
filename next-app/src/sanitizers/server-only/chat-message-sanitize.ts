import type { IChatMessageDTO } from "@/models/chat-message/chat-message-types";
import type { ChatMessageSchemaType } from "@/schemas/model/chat-message/chat-message-types";
import type { IChatMessageDTOWithPopulatedSender } from "@/models/mixed-types";
import { sanitizeMinUserInfo } from "./user-sanitize";

export function sanitizeChatMessage(m: IChatMessageDTO): ChatMessageSchemaType {
  return {
    id: m._id.toString(),
    groupId: m.groupId.toString(),
    senderId: m.senderId.toString(),
    message: m.message,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

export function sanitizeChatMessageWithPopulatedSender(
  m: IChatMessageDTOWithPopulatedSender
) {
  return {
    id: m._id.toString(),
    groupId: m.groupId.toString(),
    sender: sanitizeMinUserInfo(m.senderId),
    message: m.message,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}
