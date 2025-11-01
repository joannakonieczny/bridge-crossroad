import type { z } from "zod";
import type { addModifyChatMessageSchema } from "./chat-schema";

export type AddMofifyChatMessageSchemaType = z.infer<
  typeof addModifyChatMessageSchema
>;
