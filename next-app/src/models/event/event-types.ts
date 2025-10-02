"server-only";

import { Schema } from "mongoose";
import type { Timestamps } from "../utils";
import type { UserId } from "../user/user-types";
import type { GroupId } from "../group/group-types";

export const EventTableName = "Event";

export const EventId = Schema.Types.ObjectId;

export type IEventDTO = {
  _id: typeof EventId;
  title: string;
  description?: string;
  startsAt: Date;
  endsAt?: Date;
  location?: string;
  organizer: typeof UserId;
  attendees: (typeof UserId)[];
  group: typeof GroupId;
  imageUrl?: string;
} & Timestamps;
