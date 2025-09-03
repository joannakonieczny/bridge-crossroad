import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { UserId, UserTableName, type IUserId } from "./user/user-types";

export const GroupId = Schema.Types.ObjectId;
export type IGroupId = typeof GroupId;

export type IGroup = Document & {
  _id: IGroupId;
  name: string;
  admins: IUserId[];
  members: IUserId[];
  imageUrl?: string;
  invitationCode: string;
  createdAt: Date;
  updatedAt: Date;
};

const Group = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
    admins: {
      type: [{ type: UserId, ref: UserTableName }],
      default: [],
      required: true,
    },
    members: {
      type: [{ type: UserId, ref: UserTableName }],
      default: [],
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    invitationCode: { type: String, required: true, length: 8 },
  },
  { timestamps: true } // auto timestamps for createdAt and updatedAt
);

export default mongoose.models.Group || mongoose.model<IGroup>("Group", Group);
