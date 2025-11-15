import type { TKeyOrMessage, TKey } from "../typed-translations";
import type { ActionError } from "./types";

export function getNestedError(obj: unknown): string | undefined {
  const seen = new WeakSet<object>();

  function visit(value: unknown): string | undefined {
    if (value == null || typeof value !== "object") return undefined;
    const o = value as Record<string, unknown>;
    if (seen.has(o)) return undefined;
    seen.add(o);

    const maybeErrors = o["_errors"];
    if (Array.isArray(maybeErrors)) {
      for (const e of maybeErrors) {
        if (typeof e === "string") return e;
      }
    }

    for (const key of Object.keys(o)) {
      if (key === "_errors") continue;
      const found = visit(o[key]);
      if (found) return found;
    }

    return undefined;
  }

  return visit(obj);
}

type Options = {
  generalErrorKey?: TKey;
  serverErrorKey?: TKey;
  validationErrorKey?: TKey;
  fallbackKey?: TKey;
};

export function getMessageKeyFromError(
  err: ActionError,
  opt?: Options
): TKeyOrMessage {
  if (err.generalError) {
    return opt?.generalErrorKey ?? ("common.error.networkError" satisfies TKey);
  }

  if (err.serverError) {
    return opt?.serverErrorKey ?? ("common.error.serverError" satisfies TKey);
  }

  const validationErrorKey = getNestedError(err.validationErrors);
  if (validationErrorKey) {
    return opt?.validationErrorKey ?? validationErrorKey;
  }

  return opt?.fallbackKey ?? ("common.error.unknownError" satisfies TKey);
}
