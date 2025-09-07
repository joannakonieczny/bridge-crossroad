"server-only";

import mongoose, { Schema } from "mongoose";
import { UserId, UserTableName } from "../user/user-types";
import { GroupValidationConstants as c } from "@/schemas/model/group/group-const";
import type { IUserId } from "../user/user-types";
import type { IGroupDTO } from "./group-types";

const Group = new Schema<IGroupDTO>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      maxlength: c.name.max,
      match: c.name.regex,
    },
    description: {
      type: String,
      required: false,
      maxlength: c.description.max,
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
      maxlength: c.imageUrl.max,
    },
    invitationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      length: c.invitationCode.length,
      regex: c.invitationCode.regex,
    },
    isMain: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true } // auto timestamps for createdAt and updatedAt
);

Group.index(
  { isMain: 1 },
  { unique: true, partialFilterExpression: { isMain: true } }
);

export default mongoose.models.Group ||
  mongoose.model<IGroupDTO>("Group", Group);
