"server-only";

import type { TKey } from "@/lib/typed-translations";
import {
  createSafeActionClient,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DEFAULT_SERVER_ERROR_MESSAGE,
  returnValidationErrors,
} from "next-safe-action";
import { requireUserId } from "./auth/simple-action";
import { requireUserOnboarding } from "./onboarding/simple-action";
import { requireGroupAccess, requireGroupAdmin } from "./groups/simple-action";
import { havingGroupId } from "@/schemas/model/group/group-schema";
import { havingChatMessageId } from "@/schemas/model/chat-message/chat-message-schema";
import { requireChatMessageAccess } from "./chat/simple-action";
import { RepositoryError } from "@/repositories/common";
import { havingPartnershipPostId } from "@/schemas/model/partnership-post/partnership-post-schema";
import { getPartnershipPost } from "@/repositories/partnership-posts";

export const action = createSafeActionClient({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleServerError(e, utils) {
    // You can access these properties inside the `utils` object.
    // const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;
    console.error("[SERVER ACTION ERR]:", e);
    return "common.error.serverError" satisfies TKey;
    // return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

/**
 * Middleware action that ensures the user is authenticated before proceeding.
 *
 * This action calls `requireUserId()` to verify authentication. If the user is not authenticated,
 * it redirects them accordingly. If authenticated, it passes the `userId` to the next middleware
 * via the context.
 *
 * @remarks
 * Use this middleware to protect routes or actions that require user authentication.
 *
 * @param next - The next middleware function to call, with the updated context containing `userId`.
 * @returns The result of calling the next middleware with the authenticated user's ID in context.
 */
export const authAction = action.use(async ({ next }) => {
  const userId = await requireUserId();
  return next({ ctx: { userId } });
});

export const fullAuthAction = authAction.use(async ({ next, ctx }) => {
  await requireUserOnboarding(ctx.userId);
  return next({ ctx: { ...(ctx ?? {}) } });
});

export const withinOwnGroupAction = fullAuthAction
  .inputSchema(havingGroupId)
  .use(async ({ next, ctx, clientInput }) => {
    const parseResult = havingGroupId.safeParse(clientInput);
    if (!parseResult.success) {
      return returnValidationErrors(havingGroupId, {
        groupId: {
          _errors: ["common.validation.invalidGroupId"],
        },
      });
    }
    const { groupId } = parseResult.data;

    await requireGroupAccess({ groupId, userId: ctx.userId });
    return next({ ctx: { ...ctx, groupId } });
  });

export const withinOwnGroupAsAdminAction = withinOwnGroupAction.use(
  async ({ next, ctx }) => {
    await requireGroupAdmin({ groupId: ctx.groupId, userId: ctx.userId });
    return next({ ctx });
  }
);

export const withinOwnChatMessageAction = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(havingChatMessageId))
  .use(async ({ next, ctx, clientInput }) => {
    const parseResult = havingChatMessageId.safeParse(clientInput);
    if (!parseResult.success) {
      return returnValidationErrors(havingChatMessageId, {
        chatMessageId: {
          _errors: ["common.validation.invalidChatMessageId"],
        },
      });
    }
    const { chatMessageId } = parseResult.data;
    await requireChatMessageAccess({
      chatMessageId,
      userId: ctx.userId,
    }).catch((e) => {
      if (e instanceof RepositoryError) {
        return returnValidationErrors(havingChatMessageId, {
          chatMessageId: {
            _errors: ["common.validation.invalidChatMessageId"],
          },
        });
      } else throw e;
    });
    return next({ ctx: { ...ctx, chatMessageId: chatMessageId } });
  });

export const withinOwnPartnershipPostAction = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(havingPartnershipPostId))
  .use(async ({ next, ctx, clientInput }) => {
    const parseRes = havingPartnershipPostId.safeParse(clientInput);
    if (!parseRes.success) {
      return returnValidationErrors(havingPartnershipPostId, {
        partnershipPostId: {
          _errors: ["common.validation.invalidPartnershipPostId"],
        },
      });
    }
    const { partnershipPostId } = parseRes.data;
    const post = await getPartnershipPost({ partnershipPostId });

    if (
      post.groupId.toString() !== ctx.groupId ||
      post.ownerId.toString() !== ctx.userId
    ) {
      // access denied
      return returnValidationErrors(havingPartnershipPostId, {
        partnershipPostId: {
          _errors: ["common.validation.invalidPartnershipPostId"],
        },
      });
    }

    return next({ ctx: { ...ctx, partnershipPostId } });
  });
