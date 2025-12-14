"server-only";

import ChatMessage from "@/models/chat-message/chat-message-model";
import dbConnect from "@/util/connect-mongo";
import { check } from "./common";
import { UserTableName } from "@/models/user/user-types";
import type { IChatMessageDTO } from "@/models/chat-message/chat-message-types";
import type {
  IChatMessageDTOWithPopulatedSender,
  IChatMessageDTOWithPopulatedSenderWithoutMessage,
} from "@/models/mixed-types";
import type {
  ChatMessageIdType,
  MessageType,
} from "@/schemas/model/chat-message/chat-message-types";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { UserIdType } from "@/schemas/model/user/user-types";

export async function getMessage(
  messageId: ChatMessageIdType
): Promise<IChatMessageDTO> {
  await dbConnect();
  return check(
    await ChatMessage.findById(messageId).lean<IChatMessageDTO>(),
    "Failed to get chat message"
  );
}

type PostMessageProps = {
  groupId: GroupIdType;
  senderId: UserIdType;
  message: MessageType;
  fileUrl?: string;
};

export async function postMessage(
  p: PostMessageProps
): Promise<IChatMessageDTO> {
  await dbConnect();

  const doc = new ChatMessage({
    groupId: p.groupId,
    senderId: p.senderId,
    message: p.message,
    fileUrl: p.fileUrl,
  });

  const saved = await doc.save();

  return check(saved?.toObject(), "Failed to post chat message");
}

type ModifyMessageProps = {
  messageId: ChatMessageIdType;
  newMessage: MessageType;
  fileUrl?: string;
};

export async function modifyMessage(
  p: ModifyMessageProps
): Promise<IChatMessageDTO> {
  await dbConnect();

  const updated = await ChatMessage.findOneAndUpdate(
    { _id: p.messageId },
    { $set: { message: p.newMessage, fileUrl: p.fileUrl } },
    { new: true, runValidators: true }
  ).lean<IChatMessageDTO>();

  return check(updated, "Failed to update chat message");
}

export async function deleteMessage(
  messageId: ChatMessageIdType
): Promise<IChatMessageDTO> {
  await dbConnect();

  const deleted = await ChatMessage.findByIdAndDelete(
    messageId
  ).lean<IChatMessageDTO>();

  return check(deleted, "Failed to delete chat message");
}

type GetMessagesParams = {
  groupId: GroupIdType;
  /**
   * Maximum number of messages to return per page. Server will fetch limit+1 to detect next page.
   */
  limit?: number;
  /**
   * Cursor for pagination. For descending order (newest first) this should be a Date object
   * representing the createdAt of the last message from the previous page. The query will return
   * messages with createdAt < cursor.
   */
  cursor?: Date;
};

export async function getMessagesForGroupWithPopulatedSender(
  params: GetMessagesParams
) {
  await dbConnect();

  const limit = Math.max(1, Math.min(params.limit ?? 20, 200));

  const query: Record<string, unknown> = { groupId: params.groupId };
  if (params.cursor) {
    // only messages older than the cursor (createdAt < cursor)
    query.createdAt = { $lt: params.cursor };
  }

  // fetch limit + 1 to detect if there's a next page
  const docs = await ChatMessage.find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .populate({ path: "senderId", model: UserTableName })
    .lean<IChatMessageDTOWithPopulatedSender[]>();

  const hasNext = docs.length > limit;
  const page = hasNext ? docs.slice(0, limit) : docs;

  // Determine nextCursor as a Date when there's another page.
  // - undefined => no next page
  // - null => there's a next page but last item has no createdAt (unlikely)
  const nextCursor: Date | null = (() => {
    if (!hasNext) return null;
    const last = page[page.length - 1];
    if (!last || !last.createdAt) return null;
    return last.createdAt instanceof Date
      ? last.createdAt
      : new Date(last.createdAt as unknown as string);
  })();

  return {
    messages: page,
    nextCursor: nextCursor,
    prevCursor: params.cursor || null,
    limit: limit,
  };
}

export async function getFileMessagesForGroupWithPopulatedSender(
  params: GetMessagesParams & { fileNameRegex?: RegExp | string }
) {
  await dbConnect();

  const limit = Math.max(1, Math.min(params.limit ?? 20, 200));

  const query: Record<string, unknown> = { groupId: params.groupId };
  // ensure fileUrl exists
  const fileExistCondition = { fileUrl: { $exists: true, $ne: null } };

  if (params.fileNameRegex) {
    const regex =
      params.fileNameRegex instanceof RegExp
        ? params.fileNameRegex
        : new RegExp(String(params.fileNameRegex));
    // use $and to combine existence check with regex match
    query.$and = [fileExistCondition, { fileUrl: { $regex: regex } }];
  } else {
    Object.assign(query, fileExistCondition);
  }
  if (params.cursor) {
    // only messages older than the cursor (createdAt < cursor)
    query.createdAt = { $lt: params.cursor };
  }

  // fetch limit + 1 to detect if there's a next page
  const docs = await ChatMessage.find(query)
    .select("-message")
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .populate({ path: "senderId", model: UserTableName })
    .lean<IChatMessageDTOWithPopulatedSenderWithoutMessage[]>();

  const hasNext = docs.length > limit;
  const page = hasNext ? docs.slice(0, limit) : docs;

  const nextCursor: Date | null = (() => {
    if (!hasNext) return null;
    const last = page[page.length - 1];
    if (!last || !last.createdAt) return null;
    return last.createdAt instanceof Date
      ? last.createdAt
      : new Date(last.createdAt as unknown as string);
  })();

  return {
    messages: page,
    nextCursor: nextCursor,
    prevCursor: params.cursor || null,
    limit: limit,
  };
}
