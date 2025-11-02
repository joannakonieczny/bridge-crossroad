import {
  getWithinOwnChatMessageAction,
  getWithinOwnGroupAction,
} from "../action-lib";
import {
  modifyMessage,
  postMessage,
  getMessagesForGroupWithPopulatedSender,
  deleteMessage,
} from "@/repositories/chat-messages";
import { sanitizeChatMessage } from "@/sanitizers/server-only/chat-message-sanitize";
import { sanitizeChatMessageWithPopulatedSender } from "@/sanitizers/server-only/chat-message-sanitize";
import {
  addModifyChatMessageSchema,
  getMessagesForGroupSchema,
} from "@/schemas/pages/with-onboarding/chat/chat-schema";
import { z } from "zod";

export const postNewMessage = getWithinOwnGroupAction(
  addModifyChatMessageSchema
).action(async ({ ctx: { groupId, userId }, parsedInput }) => {
  const res = await postMessage({
    groupId,
    senderId: userId,
    message: parsedInput.message,
  });
  return sanitizeChatMessage(res);
});

export const modifyExistingMessage = getWithinOwnChatMessageAction(
  addModifyChatMessageSchema
).action(async ({ parsedInput, ctx }) => {
  const res = await modifyMessage({
    messageId: ctx.chatMessageId,
    newMessage: parsedInput.message,
  });
  return sanitizeChatMessage(res);
});

export const deleteExistingMessage = getWithinOwnChatMessageAction(
  z.object({})
).action(async ({ ctx }) => {
  const res = await deleteMessage(ctx.chatMessageId);
  return sanitizeChatMessage(res);
});

export const getMessagesForGroup = getWithinOwnGroupAction(
  getMessagesForGroupSchema
).action(async ({ parsedInput, ctx }) => {
  const res = await getMessagesForGroupWithPopulatedSender({
    groupId: ctx.groupId,
    limit: parsedInput.limit,
    cursor: parsedInput.cursor,
  });

  return {
    messages: res.messages.map(sanitizeChatMessageWithPopulatedSender),
    nextCursor: res.nextCursor,
    prevCursor: parsedInput.cursor ?? null,
    limit: res.limit,
  };
});
