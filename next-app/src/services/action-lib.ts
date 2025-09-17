/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TKey } from "@/lib/typed-translations";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { requireUserId } from "./auth/simple-action";

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
