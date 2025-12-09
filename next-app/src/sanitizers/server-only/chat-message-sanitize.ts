import type { IChatMessageDTO } from "@/models/chat-message/chat-message-types";
import type {
  ChatMessageSchemaType,
  MessageWithPopulatedSenderType,
} from "@/schemas/model/chat-message/chat-message-types";
import type { IChatMessageDTOWithPopulatedSender } from "@/models/mixed-types";
import type { UserIdType } from "@/schemas/model/user/user-types";
import { sanitizeMinUserInfo } from "./user-sanitize";
import { sanitizeFileUrl } from "./common";

export function sanitizeChatMessage(m: IChatMessageDTO): ChatMessageSchemaType {
  return {
    id: m._id.toString(),
    groupId: m.groupId.toString(),
    senderId: m.senderId.toString(),
    message: m.message,
    fileUrl: sanitizeFileUrl(m.fileUrl),
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

type MappersType = {
  userId: UserIdType;
  adminsIds: UserIdType[];
};

export function sanitizeChatMessageWithPopulatedSender(
  m: IChatMessageDTOWithPopulatedSender,
  mappers?: MappersType
): MessageWithPopulatedSenderType {
  const enhancedSender = mappers
    ? {
        ...sanitizeMinUserInfo(m.senderId),
        isCurrentUser: m.senderId._id.toString() === mappers.userId,
        isGroupAdmin: mappers.adminsIds.includes(m.senderId._id.toString()),
      }
    : sanitizeMinUserInfo(m.senderId);

  return {
    id: m._id.toString(),
    groupId: m.groupId.toString(),
    sender: enhancedSender,
    message: m.message,
    fileUrl: sanitizeFileUrl(m.fileUrl),
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}
