import {
  useTranslations,
  useTranslationsWithFallback,
} from "../typed-translations";
import { getNestedError } from "./helpers";
import type { ActionError } from "./types";

/**
 *
 * @param template {
 *
 *    serverError:
 *                "Wystąpił błąd przy pobieraniu {template}.",
 *
 *    validationError:
 *                "Wystąpił błąd walidacji danych przy pobieraniu {template}.",
 *
 *    networkError:
 *                "Wystąpił błąd sieci przy pobieraniu {template}. Sprawdź połączenie internetowe.",
 *
 *    unknownError:
 *                "Wystąpił błąd przy pobieraniu {template}. Spróbuj ponownie później.",
 *  },
 *
 *
 * }
 * @returns
 */
export function useGetMessageFromError(template: string) {
  const tV = useTranslationsWithFallback(
    "",
    "common.errorTemplate.validationError"
  );
  const t = useTranslations();

  function helper(err: ActionError) {
    if (err.generalError) {
      return t("common.errorTemplate.networkError", { template });
    }

    if (err.serverError) {
      return t("common.errorTemplate.serverError", { template });
    }

    const validationErrorKey = getNestedError(err.validationErrors);
    if (validationErrorKey) {
      return tV(validationErrorKey);
    }

    return t("common.errorTemplate.unknownError", { template });
  }

  return helper;
}
