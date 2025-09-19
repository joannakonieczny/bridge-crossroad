"server-only";

export class RepositoryError extends Error {
  public readonly isRepositoryError = true;
  /**
   * @param message error message
   * @param cause optional original error
   */
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = "RepositoryError";

    // optionally attach the original error's stack trace
    if (cause && cause.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }
}

/**
 * Handles errors thrown within repository operations.
 * If the provided error is not an instance of `RepositoryError`, it is re-thrown.
 * Otherwise, executes the provided fallback function and returns its result.
 *
 * @typeParam R - The return type of the fallback function.
 * @param err - The error to handle.
 * @param fn - A function to execute if the error is a `RepositoryError`.
 * @returns The result of the fallback function if the error is a `RepositoryError`.
 * @throws The original error if it is not a `RepositoryError`.
 */
export function onRepoError<R>(err: Error, fn: () => R): R {
  if (!(err instanceof RepositoryError)) throw err;
  return fn();
}

/**
 * Throws a {@link RepositoryError} with the provided error message if the given value is `null` or `undefined`.
 * Otherwise, returns the value.
 *
 * @typeParam T - The type of the value to check.
 * @param value - The value to check for `null` or `undefined`.
 * @param errMessage - The error message to use if the value is `null` or `undefined`.
 * @returns The non-null, non-undefined value.
 * @throws {RepositoryError} If the value is `null` or `undefined`.
 */
function onNullThrow<T>(value: T | null | undefined, errMessage: string): T {
  if (value === null || value === undefined) {
    throw new RepositoryError(errMessage);
  }
  return value;
}

export { onNullThrow as check };

import mongoose from "mongoose";

/**
 * Executes the provided callback within a mongoose transaction.
 * If an external session is provided it will be used directly (no session lifecycle management).
 * If no session is provided this helper will create a session, run `withTransaction` and ensure the session is ended.
 */
export async function executeWithinTransaction<T>(
  fn: (s: mongoose.ClientSession) => Promise<T>,
  session?: mongoose.ClientSession
): Promise<T> {
  if (session) {
    return fn(session);
  }

  const s = await mongoose.startSession();
  try {
    return await s.withTransaction(() => fn(s));
  } finally {
    await s.endSession();
  }
}

/**
 * Chainable helper to handle Mongo duplicate key errors.
 * Usage:
 * onDuplicateKey(err)
 *   .on('email', () => returnValidationErrors(schema, { email: { _errors: [...] } }))
 *   .on('nickname', () => ...)
 *   .handle();
 */
export function onDuplicateKey(error: unknown) {
  const handlers = new Map<string, () => unknown>();

  return {
    on(field: string, fn: () => unknown) {
      handlers.set(field, fn);
      return this;
    },
    handle() {
      if (
        !(error instanceof Error) ||
        !error.message.includes("duplicate key")
      ) {
        throw error;
      }

      for (const [field, fn] of handlers.entries()) {
        if (error.message.includes(field)) {
          return fn();
        }
      }

      // If no handler matched, rethrow the original error
      throw error;
    },
  };
}

export type WithSession = {
  session?: mongoose.ClientSession;
};
