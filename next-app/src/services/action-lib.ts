/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TKey } from "@/lib/typed-translations";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export const action = createSafeActionClient({
  async handleServerError(e, utils) {
    // You can access these properties inside the `utils` object.
    // const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;
    console.error("[SERVER ACTION ERR]:", e);
    return "common.error.serverError" satisfies TKey;
    // return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
