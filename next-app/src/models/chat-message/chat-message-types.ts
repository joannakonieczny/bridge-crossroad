"server-only";

import { Schema } from "mongoose";
import type { Timestamps } from "../utils";
import type { UserId } from "../user/user-types";
import type { GroupId } from "../group/group-types";

export const ChatMessagesTableName = "ChatMessages";
export const ChatMessageId = Schema.Types.ObjectId;

export type IChatMessageDTO = {
  _id: typeof ChatMessageId;
  groupId: typeof GroupId;
  senderId: typeof UserId;
  message: string;
} & Timestamps;
