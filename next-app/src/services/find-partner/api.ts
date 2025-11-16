"use server";

import {
  listPartnershipPostsInGroup,
  addPartnershipPost,
  removePartnershipPost,
  addInterestedUser,
  removeInterestedUser,
} from "@/repositories/partnership-posts";
import {
  getWithinOwnGroupAction,
  getWithinOwnParnershipPostAction,
} from "../action-lib";
import { addPartnershipPostSchema } from "@/schemas/pages/with-onboarding/partnership-posts/partnership-posts-schema";
import { z } from "zod";
import { havingPartnershipPostId } from "@/schemas/model/partnership-post/partnership-post-schema";
import { getById as getGroupById } from "@/repositories/groups";
import { PartnershipPostType } from "@/club-preset/partnership-post";
import {
  sanitizePartnershipPost,
  sanitizePartnershipPostPopulated,
} from "@/sanitizers/server-only/partnership-post-sanitize";

export const listPartnershipPosts = getWithinOwnGroupAction(
  z.object({})
).action(async ({ ctx: { groupId } }) => {
  const res = await listPartnershipPostsInGroup({ groupId });
  return res.map(sanitizePartnershipPostPopulated);
});

export const createPartnershipPost = getWithinOwnGroupAction(
  addPartnershipPostSchema
).action(async ({ parsedInput: postData, ctx: { groupId, userId } }) => {
  //verify eventId if its within group
  if (postData.data.type === PartnershipPostType.SINGLE) {
    const { eventId } = postData.data;

    const group = await getGroupById(groupId);
    if (!group.events.find((event) => event.toString() === eventId)) {
      throw new Error("Provided eventId does not belong to this group");
    }
  }

  const res = await addPartnershipPost({
    groupId,
    ownerId: userId,
    post: postData,
  });
  return sanitizePartnershipPost(res);
});

export const addInterested = getWithinOwnGroupAction(
  havingPartnershipPostId
).action(async ({ parsedInput: { partnershipPostId }, ctx: { userId } }) => {
  const res = await addInterestedUser({
    partnershipPostId,
    interestedUserId: userId,
  });
  return sanitizePartnershipPost(res);
});

export const removeInterested = getWithinOwnGroupAction(
  havingPartnershipPostId
).action(async ({ parsedInput: { partnershipPostId }, ctx: { userId } }) => {
  const res = await removeInterestedUser({
    partnershipPostId,
    interestedUserId: userId,
  });
  return sanitizePartnershipPost(res);
});

export const deletePartnershipPost = getWithinOwnParnershipPostAction(
  z.object({})
).action(async ({ ctx: { partnershipPostId } }) => {
  const res = await removePartnershipPost({ partnershipPostId });
  return sanitizePartnershipPost(res);
});
