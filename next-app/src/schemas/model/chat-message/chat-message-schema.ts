import z from "zod";
import { ChatMessageValidationConstants } from "./chat-message-const";
import { idPropSchema, withTimeStampsSchema } from "@/schemas/common";
import type { TKey } from "@/lib/typed-translations";

export const messageSchema = z
  .string()
  .min(
    ChatMessageValidationConstants.message.min,
    "validation.model.chatMessage.message.min" satisfies TKey
  )
  .max(
    ChatMessageValidationConstants.message.max,
    "validation.model.chatMessage.message.max" satisfies TKey
  );

export const chatMessageSchema = z
  .object({
    id: idPropSchema,
    groupId: idPropSchema,
    senderId: idPropSchema,
    message: messageSchema,
  })
  .merge(withTimeStampsSchema);
