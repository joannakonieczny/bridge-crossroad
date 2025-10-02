"server-only";

import { Schema } from "mongoose";
import type { EventId } from "../event/event-types";
import type { Timestamps } from "../utils";
import type { UserId } from "../user/user-types";

export const GroupTableName = "Group";

export const GroupId = Schema.Types.ObjectId;

export type IGroupDTO = {
  _id: typeof GroupId;
  name: string;
  description?: string;
  admins: (typeof UserId)[];
  members: (typeof UserId)[];
  events: (typeof EventId)[];
  imageUrl?: string;
  invitationCode: string;
  isMain?: boolean;
} & Timestamps;
