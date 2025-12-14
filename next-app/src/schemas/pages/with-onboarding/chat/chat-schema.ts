import { filePathSchema } from "@/schemas/common";
import { messageSchema } from "@/schemas/model/chat-message/chat-message-schema";
import { z } from "zod";

export const addModifyChatMessageSchema = z.object({
  message: messageSchema,
  fileUrl: filePathSchema.optional(),
});

export const getMessagesForGroupSchema = z.object({
  limit: z.number().int().min(1).max(200).optional(),
  // accept either a Date object or an ISO string (which will be parsed to Date)
  cursor: z
    .preprocess((arg) => {
      if (arg instanceof Date) return arg;
      if (typeof arg === "string") {
        const d = new Date(arg);
        return isNaN(d.getTime()) ? arg : d;
      }
      return arg;
    }, z.date())
    .optional(),
});

export const getChatFilesForGroupSchema = getMessagesForGroupSchema.extend({
  fileType: z.enum(["image", "other"]).default("other"),
});
