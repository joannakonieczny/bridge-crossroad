import {
  getWithinOwnChatMessageAction,
  getWithinOwnGroupAction,
} from "../action-lib";
import { modifyMessage, postMessage } from "@/repositories/chat-messages";
import { addModifyChatMessageSchema } from "@/schemas/pages/with-onboarding/chat/chat-schema";

export const postNewMessage = getWithinOwnGroupAction(
  addModifyChatMessageSchema
).action(async ({ ctx: { groupId, userId }, parsedInput }) => {
  const res = await postMessage({
    groupId,
    senderId: userId,
    message: parsedInput.message,
  });
  return res;
});

export const modifyExistingMessage = getWithinOwnChatMessageAction(
  addModifyChatMessageSchema
).action(async ({ parsedInput, ctx }) => {
  const res = await modifyMessage({
    messageId: ctx.chatMessageId,
    newMessage: parsedInput.message,
  });
  return res;
});
