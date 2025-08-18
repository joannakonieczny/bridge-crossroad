import type {
  UseMutationResult,
  UseMutationOptions as TanstackMutationOptions,
} from "@tanstack/react-query";
import { useMutation as useTanstackMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import type { TKey } from "../typed-translations";

type ServerError = string | TKey;

type ActionResult<TData = unknown, TValidationErrors = unknown> = {
  data?: TData;
  serverError?: ServerError;
  validationErrors?: TValidationErrors;
};

type GeneralError = unknown; //probably Error

type UseActionMutationError<TValidationErrors = unknown> = Error & {
  serverError?: ServerError;
  validationErrors?: TValidationErrors;
  generalError?: GeneralError;
};

type UseActionMutationOptions<
  TData = unknown,
  TVariables = unknown,
  TValidationErrors = unknown
> = Omit<
  TanstackMutationOptions<
    TData,
    UseActionMutationError<TValidationErrors>,
    TVariables
  >,
  "mutationFn"
> & {
  action: (
    variables: TVariables
  ) => Promise<ActionResult<TData, TValidationErrors>>;
  onError?: (error: UseActionMutationError<TValidationErrors>) => void;
};

export function useActionMutation<
  TData = unknown,
  TVariables = unknown,
  TValidationErrors = unknown
>(
  options: UseActionMutationOptions<TData, TVariables, TValidationErrors>
): UseMutationResult<
  TData,
  UseActionMutationError<TValidationErrors>,
  TVariables
> {
  const { action, onError, ...mutationOptions } = options;

  const result = useTanstackMutation<
    TData,
    UseActionMutationError<TValidationErrors>,
    TVariables
  >({
    ...mutationOptions,
    mutationFn: async (variables: TVariables) => {
      try {
        const actionResult = await action(variables);

        if (actionResult.serverError) {
          const error = Object.assign(new Error(actionResult.serverError), {
            serverError: actionResult.serverError,
          }) as UseActionMutationError<TValidationErrors>;
          throw error;
        }

        if (actionResult.validationErrors) {
          const error = Object.assign(new Error("Validation errors occurred"), {
            validationErrors: actionResult.validationErrors,
          }) as UseActionMutationError<TValidationErrors>;
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
        }) as UseActionMutationError<TValidationErrors>;
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
