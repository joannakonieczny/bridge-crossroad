"server-only";

import mongoose, { Schema } from "mongoose";
import { UserId, UserTableName } from "../user/user-types";
import type { IGroup } from "./group-types";

const Group = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: false,
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
    invitationCode: {
      type: String,
      required: true,
      length: 8,
      unique: true,
      index: true,
    },
  },
  { timestamps: true } // auto timestamps for createdAt and updatedAt
);

export default mongoose.models.Group || mongoose.model<IGroup>("Group", Group);
