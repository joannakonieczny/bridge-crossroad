"server-only";

import mongoose, { Schema } from "mongoose";
import { UserId, UserTableName } from "../user/user-types";
import { GroupId, GroupTableName } from "../group/group-types";
import { EventTableName, type IEventDTO } from "./event-types";

const Event = new Schema<IEventDTO>(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: false },
    location: { type: String, required: false },
    organizer: { type: UserId, ref: UserTableName, required: true },
    attendees: { type: [{ type: UserId, ref: UserTableName }], default: [] },
    group: { type: GroupId, ref: GroupTableName, required: true, index: true },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEventDTO>(EventTableName, Event);
