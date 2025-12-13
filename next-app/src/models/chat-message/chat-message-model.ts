"server-only";

import mongoose, { Schema } from "mongoose";
import { ChatMessagesTableName } from "./chat-message-types";
import { UserId, UserTableName } from "../user/user-types";
import { GroupId, GroupTableName } from "../group/group-types";
import type { IChatMessageDTO } from "./chat-message-types";

const ChatMessageModel = new Schema<IChatMessageDTO>(
  {
    groupId: {
      type: GroupId,
      required: true,
      ref: GroupTableName,
    },
    senderId: { type: UserId, required: true, ref: UserTableName },
    message: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
  }
);

ChatMessageModel.index({ groupId: 1, createdAt: -1 });

export default mongoose.models.ChatMessage ||
  mongoose.model<IChatMessageDTO>(ChatMessagesTableName, ChatMessageModel);
