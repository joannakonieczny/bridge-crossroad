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
import {
  addPartnershipPostSchema,
  listPartnershipPostsSchema,
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
import type { IPartnershipPostPopulated } from "@/models/mixed-types";

export const listPartnershipPosts = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(listPartnershipPostsSchema))
  .action(
    async ({
      ctx: { groupId, userId },
      parsedInput: { status, page, limit, type, onboardingData },
    }) => {
      const validPosts: IPartnershipPostPopulated[] = [];
      const expiredPosts: IPartnershipPostPopulated[] = [];
      let currentPage = page;
      let totalPages = 0;
      let total = 0;

      // Keep fetching pages until we have enough valid posts or run out of data
      while (validPosts.length < limit) {
        const { data: res, pagination } = await listPartnershipPostsInGroup({
          groupId,
          status,
          page: currentPage,
          limit,
          type,
          onboardingData,
        });

        totalPages = pagination.totalPages;
        total = pagination.total;

        if (res.length === 0) {
          // No more posts to fetch
          break;
        }

        // Filter out posts to be marked as EXPIRED
        const [valid, expired] = partition(res, (post) => {
          if (post.status !== PartnershipPostStatus.ACTIVE) return true; //only look at active posts (not PARTNER_FOUND)
          if (post.data.type === PartnershipPostType.PERIOD) {
            if (post.data.endsAt >= new Date()) return true; //keep in posts
          } else {
            const event = post.data.eventId;
            if (event.duration.endsAt >= new Date()) return true; //keep in posts
          }
          return false;
        });

        validPosts.push(...valid);
        expiredPosts.push(...expired);

        // If we have enough valid posts or reached the last page, stop
        if (validPosts.length >= limit || currentPage >= totalPages) {
          break;
        }

        currentPage++;
      }

      // Trim to exact limit
      const postsToReturn = validPosts.slice(0, limit);

      // Async changing status of outdated posts
      if (expiredPosts.length > 0) {
        Promise.allSettled([
          changeStatusOfManyPartnershipPosts({
            partnershipPostIds: expiredPosts.map((p) => p._id.toString()),
            status: PartnershipPostStatus.EXPIRED,
          }),
        ]);
      }

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
