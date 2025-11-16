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
import type { IPartnershipPostPopulated } from "@/models/mixed-types";
import { PartnershipPostType } from "@/club-preset/partnership-post";
import { sanitizeMinUserInfo } from "./user-sanitize";
import { sanitizeGroup } from "./group-sanitize";

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

export function sanitizePartnershipPostPopulated(
  post: IPartnershipPostPopulated
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
        ? sanitizeSingleData(post.data)
        : sanitizePeriodData(post.data),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}
