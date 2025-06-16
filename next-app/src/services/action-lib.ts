import { getTranslations } from "next-intl/server";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export const action = createSafeActionClient({
  async handleServerError(e, utils) {
    try {
      const t = await getTranslations("common.error");
      // You can access these properties inside the `utils` object.
      // const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;
      console.error("Server error:", e);
      return t("general", {
        error: e.message + utils.clientInput,
      });
    } catch {
      // Fallback to the default error message if translations are not available
      return DEFAULT_SERVER_ERROR_MESSAGE;
    }
  },
});
