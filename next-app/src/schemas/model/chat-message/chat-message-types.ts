import type { z } from "zod";
import type * as s from "./chat-message-schema";

export type MessageType = z.infer<typeof s.messageSchema>;
export type ChatMessageSchemaType = z.infer<typeof s.chatMessageSchema>;
