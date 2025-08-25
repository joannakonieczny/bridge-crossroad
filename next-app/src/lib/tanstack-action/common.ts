import { useEffect } from "react";
import type { ActionResult, ActionError } from "./types";

export async function handleActionResult<TData, TValidationErrors>(
  actionResult: ActionResult<TData, TValidationErrors>
): Promise<TData> {
  if (actionResult.serverError) {
    const error = Object.assign(new Error(actionResult.serverError), {
      serverError: actionResult.serverError,
    }) as ActionError<TValidationErrors>;
    throw error;
  }

  if (actionResult.validationErrors) {
    const error = Object.assign(new Error("Validation errors occurred"), {
      validationErrors: actionResult.validationErrors,
    }) as ActionError<TValidationErrors>;
    throw error;
  }

  return actionResult.data as TData;
}

export function handleGeneralError<TValidationErrors>(err: unknown): never {
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
  }) as ActionError<TValidationErrors>;
  throw error;
}

export async function executeAction<TData, TValidationErrors>(
  action: () => Promise<ActionResult<TData, TValidationErrors>>
): Promise<TData> {
  try {
    const actionResult = await action();
    return await handleActionResult(actionResult);
  } catch (err) {
    handleGeneralError<TValidationErrors>(err);
  }
}

export function useErrorHandler<TValidationErrors>(
  isError: boolean,
  error: ActionError<TValidationErrors> | null,
  onError?: (error: ActionError<TValidationErrors>) => void
) {
  useEffect(() => {
    if (isError && onError && error) {
      onError(error);
    }
  }, [isError, error, onError]);
}
