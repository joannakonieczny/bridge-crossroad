"server-only";

import dbConnect from "@/util/connect-mongo";
import PartnershipPost from "@/models/partnership-post/partership-post-model";
import { UserTableName } from "@/models/user/user-types";
import { GroupTableName } from "@/models/group/group-types";
import { check } from "./common";
import { EventTableName } from "@/models/event/event-types";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { AddPartnershipPostSchemaType } from "@/schemas/pages/with-onboarding/partnership-posts/partnership-posts-types";
import type { IPartnershipPostPopulated } from "@/models/mixed-types";
import type { UserIdType } from "@/schemas/model/user/user-types";
import type { PartnershipPostIdType } from "@/schemas/model/partnership-post/partnership-post-types";
import type { IPartnershipPostDTO } from "@/models/partnership-post/partnership-post-types";
import type { PartnershipPostStatus } from "@/club-preset/partnership-post";

export async function listPartnershipPostsInGroup({
  groupId,
  status,
}: {
  groupId: GroupIdType;
  status: PartnershipPostStatus;
}) {
  await dbConnect();

  const res = await PartnershipPost.find({ groupId, status })
    .populate([
      { path: "ownerId", model: UserTableName },
      { path: "interestedUsersIds", model: UserTableName },
      { path: "groupId", model: GroupTableName },
      { path: "post.data.eventId", model: EventTableName },
    ])
    .lean<IPartnershipPostPopulated[]>();

  return check(res, `Failed to list partnership posts for group ${groupId}`);
}

export async function addPartnershipPost({
  groupId,
  ownerId,
  post,
}: {
  groupId: GroupIdType;
  ownerId: UserIdType;
  post: AddPartnershipPostSchemaType;
}) {
  await dbConnect();
  const doc = new PartnershipPost({ ...post, ownerId, groupId });
  const saved = await doc.save();
  return check(saved?.toObject(), "Failed to add new partnership post");
}

export async function removePartnershipPost({
  partnershipPostId,
}: {
  partnershipPostId: PartnershipPostIdType;
}) {
  await dbConnect();
  const deleted = await PartnershipPost.findByIdAndDelete(
    partnershipPostId
  ).lean<IPartnershipPostDTO>();
  return check(deleted, "Failed to delete partnership post");
}

export async function addInterestedUser({
  partnershipPostId,
  interestedUserId,
}: {
  partnershipPostId: PartnershipPostIdType;
  interestedUserId: UserIdType;
}) {
  await dbConnect();
  const updated = await PartnershipPost.findByIdAndUpdate(
    partnershipPostId,
    { $addToSet: { interestedUsersIds: interestedUserId } },
    { new: true }
  ).lean<IPartnershipPostDTO>();
  return check(updated, "Failed to add interested user");
}

export async function removeInterestedUser({
  partnershipPostId,
  interestedUserId,
}: {
  partnershipPostId: PartnershipPostIdType;
  interestedUserId: UserIdType;
}) {
  await dbConnect();
  const updated = await PartnershipPost.findByIdAndUpdate(
    partnershipPostId,
    { $pull: { interestedUsersIds: interestedUserId } },
    { new: true }
  ).lean<IPartnershipPostDTO>();
  return check(updated, "Failed to remove interested user");
}

export async function getPartnershipPost({
  partnershipPostId,
}: {
  partnershipPostId: PartnershipPostIdType;
}) {
  await dbConnect();
  const post = await PartnershipPost.findById(
    partnershipPostId
  ).lean<IPartnershipPostDTO>();
  return check(post, "Partnership post not found");
}

export async function changeStatusOfPartnershipPost({
  partnershipPostId,
  status,
}: {
  partnershipPostId: PartnershipPostIdType;
  status: PartnershipPostStatus;
}) {
  await dbConnect();
  const updated = await PartnershipPost.findByIdAndUpdate(
    partnershipPostId,
    { status },
    { new: true }
  ).lean<IPartnershipPostDTO>();
  return check(updated, "Failed to change status of partnership post");
}

export async function changeStatusOfManyPartnershipPosts({
  partnershipPostIds,
  status,
}: {
  partnershipPostIds: PartnershipPostIdType[];
  status: PartnershipPostStatus;
}) {
  await dbConnect();
  const result = await PartnershipPost.updateMany(
    { _id: { $in: partnershipPostIds } },
    { status }
  );
  check(
    result.modifiedCount > 0 ? result : null,
    "Failed to change status of partnership posts"
  );
  return result.modifiedCount;
}
