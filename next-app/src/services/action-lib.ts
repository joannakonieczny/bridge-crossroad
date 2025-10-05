/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TKey } from "@/lib/typed-translations";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
  returnValidationErrors,
} from "next-safe-action";
import { requireUserId } from "./auth/simple-action";
import { requireUserOnboarding } from "./onboarding/simple-action";
import { requireGroupAccess, requireGroupAdmin } from "./groups/simple-action";
import { havingGroupId } from "@/schemas/model/group/group-schema";

export const action = createSafeActionClient({
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
      // rzuć validation error zamiast zwykłego Error
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
