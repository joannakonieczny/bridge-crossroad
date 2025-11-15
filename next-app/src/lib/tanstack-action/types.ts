import type { TKey } from "../typed-translations";

export type ServerError = string | TKey;

export type ActionResult<TData = unknown, TValidationErrors = unknown> = {
  data?: TData;
  serverError?: ServerError;
  validationErrors?: TValidationErrors;
};

export type GeneralError = unknown; //probably Error

export type ActionError<TValidationErrors = unknown> = Error & {
  serverError?: ServerError;
  validationErrors?: TValidationErrors;
  generalError?: GeneralError;
};

// Helper type: inferuje typ pierwszego argumentu akcji
export type ActionInput<TAction> = TAction extends (arg: infer A) => unknown
  ? A
  : TAction extends (...args: infer P) => unknown
  ? P[0]
  : never;

// Infers the error type from a mutation object (e.g. typeof loginAction)
export type MutationOrQuerryError<TMutation> = TMutation extends {
  error: infer E;
}
  ? NonNullable<E>
  : never;

// Infers ActionError<TValidationErrors> from an action function returning ActionResult
export type ActionErrorFromAction<TAction> = TAction extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R extends ActionResult<unknown, infer V>
    ? ActionError<V>
    : never
  : never;

/**
 * Helper type to extract the 'data' type from a server action function.
 * Works with next-safe-action actions that return { data, validationErrors, ... }
 *
 * @example
 * type JoinedGroupsData = TDataHelper<typeof getJoinedGroupsInfo>
 */
export type TDataHelper<
  T extends (...args: never[]) => Promise<{ data?: unknown }>
> = Awaited<ReturnType<T>>["data"];

/**
 * Helper type to extract the 'validationErrors' type from a server action function.
 * Works with next-safe-action actions that return { data, validationErrors, ... }
 *
 * @example
 * type JoinedGroupsValidationErrors = TValidationErrorsHelper<typeof getJoinedGroupsInfo>
 */
export type TValidationErrorsHelper<
  T extends (...args: never[]) => Promise<{ validationErrors?: unknown }>
> = Awaited<ReturnType<T>>["validationErrors"];

/**
 * Helper type to extract the 'serverError' type from a server action function.
 * Works with next-safe-action actions that return { data, serverError, ... }
 *
 * @example
 * type JoinedGroupsServerError = TServerErrorHelper<typeof getJoinedGroupsInfo>
 */
export type TServerErrorHelper<
  T extends (...args: never[]) => Promise<{ serverError?: unknown }>
> = Awaited<ReturnType<T>>["serverError"];

/**
 * Helper type to create UseActionQueryOptions with inferred types from a server action,
 * omitting 'queryKey' and 'action' which will be provided separately.
 *
 * @example
 * function useJoinedGroupsQuery(props?: TActionQueryOptionsHelper<typeof getJoinedGroupsInfo>) {
 *   return useActionQuery({
 *     queryKey: QUERY_KEYS.groups,
 *     action: getJoinedGroupsInfo,
 *     ...props,
 *   });
 * }
 */
export type TActionQueryOptionsHelper<
  T extends (
    ...args: never[]
  ) => Promise<{ data?: unknown; validationErrors?: unknown }>
> = Omit<
  import("./actions-querry").UseActionQueryOptions<
    TDataHelper<T>,
    TValidationErrorsHelper<T>
  >,
  "queryKey" | "action"
>;
