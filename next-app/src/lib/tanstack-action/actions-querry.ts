import type {
  UseQueryResult,
  UseQueryOptions as TanstackQueryOptions,
} from "@tanstack/react-query";
import { useQuery as useTanstackQuerry } from "@tanstack/react-query";
import { useEffect } from "react";
import type { TKey } from "../typed-translations";

type ServerError = string | TKey;

type ActionResult<TData = unknown, TValidationErrors = unknown> = {
  data?: TData;
  serverError?: ServerError;
  validationErrors?: TValidationErrors;
};

type GeneralError = unknown; //probably Error

type UseActionQueryError<TValidationErrors = unknown> = Error & {
  serverError?: ServerError;
  validationErrors?: TValidationErrors;
  generalError?: GeneralError;
};

type UseActionQueryOptions<TData = unknown, TValidationErrors = unknown> = Omit<
  TanstackQueryOptions<TData, UseActionQueryError<TValidationErrors>, TData>,
  "queryFn"
> & {
  action: () => Promise<ActionResult<TData, TValidationErrors>>;
  onError?: (error: UseActionQueryError<TValidationErrors>) => void;
};

export function useActionQuery<TData = unknown, TValidationErrors = unknown>(
  options: UseActionQueryOptions<TData, TValidationErrors>
): UseQueryResult<TData, UseActionQueryError<TValidationErrors>> {
  const { action, onError, ...queryOptions } = options;

  const result = useTanstackQuerry<
    TData,
    UseActionQueryError<TValidationErrors>
  >({
    ...queryOptions,
    queryFn: async () => {
      try {
        const actionResult = await action();

        if (actionResult.serverError) {
          const error = Object.assign(new Error(actionResult.serverError), {
            serverError: actionResult.serverError,
          }) as UseActionQueryError<TValidationErrors>;
          throw error;
        }

        if (actionResult.validationErrors) {
          const error = Object.assign(new Error("Validation errors occurred"), {
            validationErrors: actionResult.validationErrors,
          }) as UseActionQueryError<TValidationErrors>;
          throw error;
        }

        return actionResult.data as TData;
      } catch (err) {
        // rethrow known errors declared using Object.assign
        if (
          typeof err === "object" &&
          err !== null &&
          ("serverError" in err || "validationErrors" in err)
        ) {
          throw err;
        }

        const error = Object.assign(new Error("General error occurred"), {
          generalError: err,
        }) as UseActionQueryError<TValidationErrors>;
        throw error;
      }
    },
  });

  useEffect(() => {
    if (result.isError && onError && result.error) {
      onError(result.error);
    }
  }, [result.isError, result.error, onError]);

  return result;
}
