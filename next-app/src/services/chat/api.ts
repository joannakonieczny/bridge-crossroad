"use server";

import { getById as getGroupById } from "@/repositories/groups";
import {
  withinOwnChatMessageAction,
  withinOwnGroupAction,
} from "../action-lib";
import {
  modifyMessage,
  postMessage,
  getMessagesForGroupWithPopulatedSender,
  getFileMessagesForGroupWithPopulatedSender,
  deleteMessage,
} from "@/repositories/chat-messages";
import {
  sanitizeChatMessage,
  sanitizeChatMessageWithPopulatedSenderWithoutMessage,
} from "@/sanitizers/server-only/chat-message-sanitize";
import { sanitizeChatMessageWithPopulatedSender } from "@/sanitizers/server-only/chat-message-sanitize";
import {
  addModifyChatMessageSchema,
  getChatFilesForGroupSchema,
  getMessagesForGroupSchema,
} from "@/schemas/pages/with-onboarding/chat/chat-schema";
import { ALLOWED_EXT_IMAGE } from "@/util/constants";

export const postNewMessage = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(addModifyChatMessageSchema))
  .action(async ({ ctx: { groupId, userId }, parsedInput }) => {
    const res = await postMessage({
      groupId,
      senderId: userId,
      message: parsedInput.message,
      fileUrl: parsedInput.fileUrl,
    });
    return sanitizeChatMessage(res);
  });

export const modifyExistingMessage = withinOwnChatMessageAction
  .inputSchema(async (s) => s.merge(addModifyChatMessageSchema))
  .action(async ({ parsedInput, ctx }) => {
    const res = await modifyMessage({
      messageId: ctx.chatMessageId,
      newMessage: parsedInput.message,
      fileUrl: parsedInput.fileUrl,
    });
    return sanitizeChatMessage(res);
  });

export const deleteExistingMessage = withinOwnChatMessageAction.action(
  async ({ ctx }) => {
    const res = await deleteMessage(ctx.chatMessageId);
    return sanitizeChatMessage(res);
  }
);

export const getMessagesForGroup = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(getMessagesForGroupSchema))
  .action(async ({ parsedInput, ctx }) => {
    const [res, group] = await Promise.all([
      getMessagesForGroupWithPopulatedSender({
        groupId: ctx.groupId,
        limit: parsedInput.limit,
        cursor: parsedInput.cursor,
      }),
      getGroupById(ctx.groupId),
    ]);

    return {
      messages: res.messages.map((message) =>
        sanitizeChatMessageWithPopulatedSender(message, {
          userId: ctx.userId,
          adminsIds: group.admins.map(toString),
        })
      ),
      nextCursor: res.nextCursor,
      prevCursor: parsedInput.cursor ?? null,
      limit: res.limit,
    };
  });

export const getChatFilesForGroup = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(getChatFilesForGroupSchema))
  .action(async ({ parsedInput, ctx }) => {
    // build regex from allowed image extensions
    const imagePattern = Array.from(ALLOWED_EXT_IMAGE)
      .map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    const fileNameRegex =
      parsedInput.fileType === "image"
        ? new RegExp(`\\.(?:${imagePattern})(\\?.*)?$`, "i") // ends with allowed image extensions
        : new RegExp(`^(?!.*\\.(?:${imagePattern})(\\?.*)?$).+`, "i"); // does not end with allowed image extensions

    const [res, group] = await Promise.all([
      getFileMessagesForGroupWithPopulatedSender({
        groupId: ctx.groupId,
        limit: parsedInput.limit,
        cursor: parsedInput.cursor,
        fileNameRegex,
      }),
      getGroupById(ctx.groupId),
    ]);

    return {
      messages: res.messages.map((message) =>
        sanitizeChatMessageWithPopulatedSenderWithoutMessage(message, {
          userId: ctx.userId,
          adminsIds: group.admins.map(toString),
        })
      ),
      nextCursor: res.nextCursor,
      prevCursor: parsedInput.cursor ?? null,
      limit: res.limit,
    };
  });
