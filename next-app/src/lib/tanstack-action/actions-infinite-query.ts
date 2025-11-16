import type {
  UseInfiniteQueryResult,
  UseInfiniteQueryOptions as TanstackInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { useInfiniteQuery as useTanstackInfiniteQuery } from "@tanstack/react-query";
import { executeAction, useErrorHandler } from "./common";
import type { ActionResult, ActionError } from "./types";

export type UseActionInfiniteQueryOptions<
  TData = unknown,
  TValidationErrors = unknown,
  TPageParam = unknown
> = Omit<
  TanstackInfiniteQueryOptions<
    TData,
    ActionError<TValidationErrors>,
    InfiniteData<TData, TPageParam>,
    TData,
    unknown[],
    TPageParam
  >,
  "queryFn"
> & {
  action: (
    pageParam: TPageParam
  ) => Promise<ActionResult<TData, TValidationErrors>>;
  onError?: (error: ActionError<TValidationErrors>) => void;
};

export function useActionInfiniteQuery<
  TData = unknown,
  TValidationErrors = unknown,
  TPageParam = unknown
>(
  options: UseActionInfiniteQueryOptions<TData, TValidationErrors, TPageParam>
): UseInfiniteQueryResult<
  InfiniteData<TData, TPageParam>,
  ActionError<TValidationErrors>
> {
  const { action, onError, ...queryOptions } = options;

  const result = useTanstackInfiniteQuery<
    TData,
    ActionError<TValidationErrors>,
    InfiniteData<TData, TPageParam>,
    unknown[],
    TPageParam
  >({
    ...queryOptions,
    queryFn: async ({ pageParam }) => {
      return await executeAction(() => action(pageParam as TPageParam));
    },
    staleTime: queryOptions?.staleTime ?? 1000 * 3, // 3 seconds
  });

  useErrorHandler(result.isError, result.error, onError);

  return result;
}
