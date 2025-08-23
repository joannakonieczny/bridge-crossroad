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
