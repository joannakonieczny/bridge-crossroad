import type {
  UseMutationResult,
  UseMutationOptions as TanstackMutationOptions,
} from "@tanstack/react-query";
import { useMutation as useTanstackMutation } from "@tanstack/react-query";
import { executeAction, useErrorHandler } from "./common";
import type { ActionResult, ActionError } from "./types";

type UseActionMutationOptions<
  TData = unknown,
  TVariables = unknown,
  TValidationErrors = unknown
> = Omit<
  TanstackMutationOptions<TData, ActionError<TValidationErrors>, TVariables>,
  "mutationFn"
> & {
  action: (
    variables: TVariables
  ) => Promise<ActionResult<TData, TValidationErrors>>;
  onError?: (error: ActionError<TValidationErrors>) => void;
};

export function useActionMutation<
  TData = unknown,
  TVariables = unknown,
  TValidationErrors = unknown
>(
  options: UseActionMutationOptions<TData, TVariables, TValidationErrors>
): UseMutationResult<TData, ActionError<TValidationErrors>, TVariables> {
  const { action, onError, ...mutationOptions } = options;

  const result = useTanstackMutation<
    TData,
    ActionError<TValidationErrors>,
    TVariables
  >({
    ...mutationOptions,
    mutationFn: async (variables: TVariables) => {
      return await executeAction(() => action(variables));
    },
  });

  useErrorHandler(result.isError, result.error, onError);

  return result;
}
