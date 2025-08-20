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

// Inferuje typ błędu z obiektu mutacji (np. typeof loginAction)
export type MutationError<TMutation> = TMutation extends { error: infer E }
  ? NonNullable<E>
  : never;

// Inferuje ActionError<TValidationErrors> z funkcji akcji zwracającej ActionResult
export type ActionErrorFromAction<TAction> = TAction extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R extends ActionResult<unknown, infer V>
    ? ActionError<V>
    : never
  : never;
