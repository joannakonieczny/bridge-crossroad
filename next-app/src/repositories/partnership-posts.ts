"server-only";

import dbConnect from "@/util/connect-mongo";
import PartnershipPost from "@/models/partnership-post/partership-post-model";
import { UserTableName } from "@/models/user/user-types";
import { GroupTableName } from "@/models/group/group-types";
import { check } from "./common";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { AddPartnershipPostSchemaType } from "@/schemas/pages/with-onboarding/partnership-posts/partnership-posts-types";
import type { IPartnershipPostPopulated } from "@/models/mixed-types";
import type { UserIdType } from "@/schemas/model/user/user-types";
import type { PartnershipPostIdType } from "@/schemas/model/partnership-post/partnership-post-types";

export async function listPartnershipPostsInGroup({
  groupId,
}: {
  groupId: GroupIdType;
}) {
  await dbConnect();

  const res = await PartnershipPost.find({ groupId })
    .populate([
      { path: "ownerId", model: UserTableName },
      { path: "interestedUsersIds", model: UserTableName },
      { path: "groupId", model: GroupTableName },
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
  const deleted = await PartnershipPost.findByIdAndDelete(partnershipPostId);
  return check(deleted?.toObject(), "Failed to delete partnership post");
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
  );
  return check(updated?.toObject(), "Failed to add interested user");
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
  );
  return check(updated?.toObject(), "Failed to remove interested user");
}
