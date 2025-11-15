import type {
  UseQueryResult,
  UseQueryOptions as TanstackQueryOptions,
} from "@tanstack/react-query";
import { useQuery as useTanstackQuerry } from "@tanstack/react-query";
import { executeAction, useErrorHandler } from "./common";
import type { ActionResult, ActionError } from "./types";

export type UseActionQueryOptions<
  TData = unknown,
  TValidationErrors = unknown
> = Omit<
  TanstackQueryOptions<TData, ActionError<TValidationErrors>, TData>,
  "queryFn"
> & {
  action: () => Promise<ActionResult<TData, TValidationErrors>>;
  onError?: (error: ActionError<TValidationErrors>) => void;
};

export function useActionQuery<TData = unknown, TValidationErrors = unknown>(
  options: UseActionQueryOptions<TData, TValidationErrors>
): UseQueryResult<TData, ActionError<TValidationErrors>> {
  const { action, onError, ...queryOptions } = options;

  const result = useTanstackQuerry<TData, ActionError<TValidationErrors>>({
    ...queryOptions,
    queryFn: async () => {
      return await executeAction(action);
    },
  });

  useErrorHandler(result.isError, result.error, onError);

  return result;
}
