"server-only";

import ChatMessage from "@/models/chat-message/chat-message-model";
import dbConnect from "@/util/connect-mongo";
import { check } from "./common";
import type { IChatMessageDTO } from "@/models/chat-message/chat-message-types";

type PostMessageData = {
  groupId: string;
  senderId: string;
  message: string;
};

export async function postMessage(
  data: PostMessageData
): Promise<IChatMessageDTO> {
  await dbConnect();

  const doc = new ChatMessage({
    groupId: data.groupId,
    senderId: data.senderId,
    message: data.message,
  });

  const saved = await doc.save();

  return check(saved?.toObject(), "Failed to post chat message");
}

export async function modifyMessage(
  messageId: string,
  newMessage: string
): Promise<IChatMessageDTO> {
  await dbConnect();

  const updated = await ChatMessage.findOneAndUpdate(
    { _id: messageId },
    { $set: { message: newMessage } },
    { new: true, runValidators: true }
  ).lean<IChatMessageDTO>();

  return check(updated, "Failed to update chat message");
}

export async function deleteMessage(
  messageId: string
): Promise<IChatMessageDTO> {
  await dbConnect();

  const deleted = await ChatMessage.findByIdAndDelete(
    messageId
  ).lean<IChatMessageDTO>();

  return check(deleted, "Failed to delete chat message");
}

type GetMessagesParams = {
  groupId: string;
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

export async function getMessagesForGroup(params: GetMessagesParams) {
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
    .lean<IChatMessageDTO[]>();

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
