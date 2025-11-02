import type { z } from "zod";
import type {
  addModifyChatMessageSchema,
  getMessagesForGroupSchema,
} from "./chat-schema";

export type AddMofifyChatMessageSchemaType = z.infer<
  typeof addModifyChatMessageSchema
>;

export type GetMessagesForGroupSchemaType = z.infer<
  typeof getMessagesForGroupSchema
>;
