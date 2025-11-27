import type {
  IPartnershipPostDTO,
  ISinglePartnershipPostData,
  IPeriodPartnershipPostData,
} from "@/models/partnership-post/partnership-post-types";
import type {
  PartnershipPostSchemaType,
  SingleDataType,
  PeriodDataType,
  PartnershipPostSchemaTypePopulated,
} from "@/schemas/model/partnership-post/partnership-post-types";
import { PartnershipPostType } from "@/club-preset/partnership-post";
import { sanitizeMinUserInfo } from "./user-sanitize";
import { sanitizeGroup } from "./group-sanitize";
import type { UserIdType } from "@/schemas/model/user/user-types";
import type { IPartnershipPostPopulated } from "@/models/mixed-types";
import { sanitizeEvent } from "./event-sanitize";

function sanitizeSingleData(data: ISinglePartnershipPostData): SingleDataType {
  return {
    type: data.type,
    eventId: data.eventId.toString(),
  };
}

function sanitizePeriodData(data: IPeriodPartnershipPostData): PeriodDataType {
  return {
    type: data.type,
    startsAt: data.startsAt,
    endsAt: data.endsAt,
  };
}

export function sanitizePartnershipPost(
  post: IPartnershipPostDTO
): PartnershipPostSchemaType {
  return {
    id: post._id.toString(),
    ownerId: post.ownerId.toString(),
    groupId: post.groupId.toString(),
    name: post.name,
    description: post.description,
    biddingSystem: post.biddingSystem,
    status: post.status,
    interestedUsersIds: post.interestedUsersIds.map((id) => id.toString()),
    data:
      post.data.type === PartnershipPostType.SINGLE
        ? sanitizeSingleData(post.data)
        : sanitizePeriodData(post.data),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

type MappersType = {
  userId: UserIdType;
};

export function sanitizePartnershipPostPopulated(
  post: IPartnershipPostPopulated,
  mappers?: MappersType
): PartnershipPostSchemaTypePopulated {
  return {
    id: post._id.toString(),
    owner: sanitizeMinUserInfo(post.ownerId),
    group: sanitizeGroup(post.groupId),
    name: post.name,
    description: post.description,
    biddingSystem: post.biddingSystem,
    status: post.status,
    interestedUsers: post.interestedUsersIds.map(sanitizeMinUserInfo),
    data:
      post.data.type === PartnershipPostType.SINGLE
        ? {
            type: post.data.type,
            event: sanitizeEvent(post.data.eventId),
          }
        : sanitizePeriodData(post.data),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    isOwnByUser: mappers
      ? post.ownerId._id.toString() === mappers.userId
      : undefined,
  };
}
