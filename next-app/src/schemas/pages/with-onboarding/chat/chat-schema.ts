import { messageSchema } from "@/schemas/model/chat-message/chat-message-schema";
import { z } from "zod";

export const addModifyChatMessageSchema = z.object({
  message: messageSchema,
});
