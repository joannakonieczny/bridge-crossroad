"server-only";

import mongoose, { Schema } from "mongoose";
import type { IUserId } from "../user/user-types";
import { UserId, UserTableName } from "../user/user-types";
import type { IGroupDTO } from "./group-types";

const Group = new Schema<IGroupDTO>(
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
      validate: {
        // only members can be admins
        validator: function (admins: IUserId[]) {
          if (!Array.isArray(admins)) return false;
          const memberIds = (this.members || []).map((m) => m?.toString());
          return admins.every((a) => memberIds.includes(a?.toString()));
        },
        message: "All admins must be members of the group",
      },
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

export default mongoose.models.Group ||
  mongoose.model<IGroupDTO>("Group", Group);
