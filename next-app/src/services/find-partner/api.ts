"use server";

import {
  listPartnershipPostsInGroup,
  addPartnershipPost,
  modifyPartnershipPost as modifyPartnershipPostRepo,
  removePartnershipPost,
  addInterestedUser,
  removeInterestedUser,
  changeStatusOfManyPartnershipPosts,
  getPartnershipPost,
  changeStatusOfPartnershipPost,
} from "@/repositories/partnership-posts";
import { getEvent } from "@/repositories/event-group";
import {
  withinOwnGroupAction,
  withinOwnPartnershipPostAction,
} from "../action-lib";
import {
  addPartnershipPostSchema,
  modifyPartnershipPostSchema,
  listPartnershipPostsSchema,
  modifyPartnershipPostStatusSchema,
} from "@/schemas/pages/with-onboarding/partnership-posts/partnership-posts-schema";
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
import { returnValidationErrors } from "next-safe-action";

export const listPartnershipPosts = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(listPartnershipPostsSchema))
  .action(
    async ({
      ctx: { groupId, userId },
      parsedInput: { status, page, limit, type, onboardingData },
    }) => {
      // Fetch all posts with filters applied
      const allPosts = await listPartnershipPostsInGroup({
        groupId,
        status,
        type,
        onboardingData,
      });

      // Filter out posts to be marked as EXPIRED
      const [validPosts, expiredPosts] = partition(allPosts, (post) => {
        if (post.status !== PartnershipPostStatus.ACTIVE) return true; //only look at active posts (not PARTNER_FOUND)
        if (post.data.type === PartnershipPostType.PERIOD) {
          if (post.data.duration.endsAt >= new Date()) return true; //keep in posts
        } else {
          const event = post.data.eventId;
          if (event.duration.endsAt >= new Date()) return true; //keep in posts
        }
        return false;
      });

      // Async changing status of outdated posts
      if (expiredPosts.length > 0) {
        Promise.allSettled([
          changeStatusOfManyPartnershipPosts({
            partnershipPostIds: expiredPosts.map((p) => p._id.toString()),
            status: PartnershipPostStatus.EXPIRED,
          }),
        ]);
      }

      // Calculate pagination
      const total = validPosts.length;
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;
      const postsToReturn = validPosts.slice(skip, skip + limit);

      return {
        data: postsToReturn.map((p) =>
          sanitizePartnershipPostPopulated(p, { userId })
        ),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    }
  );

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

export const modifyPartnershipPost = withinOwnPartnershipPostAction
  .inputSchema(async (s) => s.merge(modifyPartnershipPostSchema))
  .action(async ({ parsedInput: postData, ctx: { partnershipPostId, groupId } }) => {
    // Verify eventId if it's being updated and is within group
    if (postData.data?.type === PartnershipPostType.SINGLE && postData.data.eventId) {
      const { eventId } = postData.data;

      const group = await getGroupById(groupId);
      if (!group.events.find((event) => event.toString() === eventId)) {
        throw new RepositoryError(
          `Provided eventId '${eventId}' does not belong to group '${groupId}'`
        );
      }
    }

    const res = await modifyPartnershipPostRepo({
      partnershipPostId,
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

export const modifyPartnershipPostStatus = withinOwnPartnershipPostAction
  .inputSchema(async (s) => s.merge(modifyPartnershipPostStatusSchema))
  .action(async ({ parsedInput: { newStatus, partnershipPostId } }) => {
    const currentPost = await getPartnershipPost({ partnershipPostId });

    let isExpired = false;
    const now = new Date();

    const postData = currentPost.data;
    if (postData.type === PartnershipPostType.PERIOD) {
      isExpired = postData.duration.endsAt < now;
    } else if (postData.type === PartnershipPostType.SINGLE) {
      const event = await getEvent({ eventId: postData.eventId.toString() });
      isExpired = event.duration.endsAt < now;
    }

    // If expired, only allow changing to EXPIRED status
    if (isExpired && newStatus !== PartnershipPostStatus.EXPIRED) {
      returnValidationErrors(modifyPartnershipPostStatusSchema, {
        newStatus: {
          _errors: [
            "validation.model.partnershipPost.status.cannotChangeExpired",
          ],
        },
      });
    }

    const res = await changeStatusOfPartnershipPost({
      partnershipPostId,
      status: newStatus,
    });
    return sanitizePartnershipPost(res);
  });
