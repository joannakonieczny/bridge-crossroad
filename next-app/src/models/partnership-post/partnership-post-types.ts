"server-only";

import { Schema } from "mongoose";
import type { Timestamps } from "../utils";
import type { UserId } from "../user/user-types";
import type { GroupId } from "../group/group-types";
import type { EventId } from "../event/event-types";
import type {
  BiddingSystem,
  PartnershipPostStatus,
  PartnershipPostType,
} from "@/club-preset/partnership-post";

export const PartnershipPostTableName = "PartnershipPost";

export const PartnershipPostId = Schema.Types.ObjectId;

export type ISinglePartnershipPostData = {
  type: PartnershipPostType.SINGLE;
  eventId: typeof EventId;
};

export type IPeriodPartnershipPostData = {
  type: PartnershipPostType.PERIOD;
  duration: {
    startsAt: Date;
    endsAt: Date;
  };
};

export type IPartnershipPostData =
  | ISinglePartnershipPostData
  | IPeriodPartnershipPostData;

export type IPartnershipPostDTO = {
  _id: typeof PartnershipPostId;
  ownerId: typeof UserId;
  groupId: typeof GroupId;
  name: string;
  description?: string;
  biddingSystem: BiddingSystem;
  status: PartnershipPostStatus;
  interestedUsersIds: (typeof UserId)[];
  data: IPartnershipPostData;
} & Timestamps;
