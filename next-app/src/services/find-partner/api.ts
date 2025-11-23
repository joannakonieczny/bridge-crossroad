"use server";

import {
  listPartnershipPostsInGroup,
  addPartnershipPost,
  removePartnershipPost,
  addInterestedUser,
  removeInterestedUser,
  changeStatusOfManyPartnershipPosts,
} from "@/repositories/partnership-posts";
import {
  withinOwnGroupAction,
  withinOwnPartnershipPostAction,
} from "../action-lib";
import { addPartnershipPostSchema } from "@/schemas/pages/with-onboarding/partnership-posts/partnership-posts-schema";
import { z } from "zod";
import { havingPartnershipPostId } from "@/schemas/model/partnership-post/partnership-post-schema";
import { getById as getGroupById } from "@/repositories/groups";
import {
  PartnershipPostStatus,
  PartnershipPostType,
} from "@/club-preset/partnership-post";
import {
  sanitizePartnershipPost,
  sanitizePartnershipPostPopulated,
} from "@/sanitizers/server-only/partnership-post-sanitize";
import { partition } from "@/util/helpers";
import { RepositoryError } from "@/repositories/common";

export const listPartnershipPosts = withinOwnGroupAction
  .inputSchema(async (s) =>
    s.merge(
      z.object({
        status: z
          .nativeEnum(PartnershipPostStatus)
          .default(PartnershipPostStatus.ACTIVE),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(10),
      })
    )
  )
  .action(async ({ ctx: { groupId, userId }, parsedInput: { status, page, limit } }) => {
    const { data: res, pagination } = await listPartnershipPostsInGroup({ groupId, status, page, limit });
    //filter out posts to be marked as EXPIRED
    const [posts, postToBeExpired] = partition(res, (post) => {
      if (post.status !== PartnershipPostStatus.ACTIVE) return true; //only look at active posts (not PARTNER_FOUND)
      if (post.data.type === PartnershipPostType.PERIOD) {
        if (post.data.endsAt >= new Date()) return true; //keep in posts
      } else {
        const event = post.data.eventId;
        if (event.duration.endsAt >= new Date()) return true; //keep in posts
      }
      return false;
    });

    //async changing status of outdated posts
    Promise.allSettled([
      changeStatusOfManyPartnershipPosts({
        partnershipPostIds: postToBeExpired.map((p) => p._id.toString()),
        status: PartnershipPostStatus.EXPIRED,
      }),
    ]);
    return {
      data: posts.map((p) => sanitizePartnershipPostPopulated(p, { userId })),
      pagination,
    };
  });

export const createPartnershipPost = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(addPartnershipPostSchema))
  .action(async ({ parsedInput: postData, ctx: { groupId, userId } }) => {
    //verify eventId if its within group
    if (postData.data.type === PartnershipPostType.SINGLE) {
      const { eventId } = postData.data;

      const group = await getGroupById(groupId);
      if (!group.events.find((event) => event.toString() === eventId)) {
        throw new RepositoryError(
          `Provided eventId '${eventId}' does not belong to group '${groupId}'`
        );
      }
    }

    const res = await addPartnershipPost({
      groupId,
      ownerId: userId,
      post: postData,
    });
    return sanitizePartnershipPost(res);
  });

export const addInterested = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(havingPartnershipPostId))
  .action(async ({ parsedInput: { partnershipPostId }, ctx: { userId } }) => {
    const res = await addInterestedUser({
      partnershipPostId,
      interestedUserId: userId,
    });
    return sanitizePartnershipPost(res);
  });

export const removeInterested = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(havingPartnershipPostId))
  .action(async ({ parsedInput: { partnershipPostId }, ctx: { userId } }) => {
    const res = await removeInterestedUser({
      partnershipPostId,
      interestedUserId: userId,
    });
    return sanitizePartnershipPost(res);
  });

export const deletePartnershipPost = withinOwnPartnershipPostAction.action(
  async ({ ctx: { partnershipPostId } }) => {
    // might throw error if not found because it was deleted already
    try {
      const res = await removePartnershipPost({ partnershipPostId });
      return sanitizePartnershipPost(res);
    } catch (e) {
      if (!(e instanceof RepositoryError)) throw e;
      //swallow not found error
      return {
        id: partnershipPostId,
      };
    }
  }
);
