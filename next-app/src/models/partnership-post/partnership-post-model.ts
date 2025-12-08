/* eslint-disable @typescript-eslint/no-unused-vars */
"server-only";

import mongoose, { Schema } from "mongoose";
import { UserId, UserTableName } from "../user/user-types";
import { GroupId, GroupTableName } from "../group/group-types";
import { EventId, EventTableName } from "../event/event-types";
import {
  BiddingSystem,
  PartnershipPostStatus,
  PartnershipPostType,
} from "@/club-preset/partnership-post";
import { PartnershipPostTableName } from "./partnership-post-types";
import type { IPartnershipPostDTO } from "./partnership-post-types";

// Base sub-schema for partnership post data with discriminator
const basePartnershipPostDataSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(PartnershipPostType),
    },
  },
  { discriminatorKey: "type", _id: false }
);

// Single discriminator
const SinglePartnershipPostDataSchema =
  basePartnershipPostDataSchema.discriminator(
    PartnershipPostType.SINGLE,
    new Schema({
      eventId: {
        type: EventId,
        ref: EventTableName,
        required: true,
        index: true,
      },
    })
  );

// Period discriminator
const PeriodPartnershipPostDataSchema =
  basePartnershipPostDataSchema.discriminator(
    PartnershipPostType.PERIOD,
    new Schema({
      duration: {
        type: new Schema(
          {
            startsAt: { type: Date, required: true },
            endsAt: { type: Date, required: true },
          },
          { _id: false }
        ),
        required: true,
      },
    })
  );

const PartnershipPost = new Schema<IPartnershipPostDTO>(
  {
    ownerId: { type: UserId, ref: UserTableName, required: true, index: true },
    groupId: {
      type: GroupId,
      ref: GroupTableName,
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: false },
    biddingSystem: {
      type: String,
      required: true,
      enum: Object.values(BiddingSystem),
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(PartnershipPostStatus),
      default: PartnershipPostStatus.ACTIVE,
      index: true,
    },
    interestedUsersIds: {
      type: [{ type: UserId, ref: UserTableName }],
      default: [],
    },
    data: basePartnershipPostDataSchema,
  },
  { timestamps: true }
);

export default mongoose.models.PartnershipPost ||
  mongoose.model<IPartnershipPostDTO>(
    PartnershipPostTableName,
    PartnershipPost
  );
