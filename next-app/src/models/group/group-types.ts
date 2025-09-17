"server-only";

import { Schema } from "mongoose";
import type { IUserId } from "../user/user-types";
import type { Timestamps } from "../utils";

export const GroupTableName = "Group";

export const GroupId = Schema.Types.ObjectId;
export type IGroupId = typeof GroupId;

export type IGroupDTO = {
  _id: IGroupId;
  name: string;
  description?: string;
  admins: IUserId[];
  members: IUserId[];
  imageUrl?: string;
  invitationCode: string;
  isMain?: boolean;
} & Timestamps;
