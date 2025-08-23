import { useTranslations as useNextIntlTranslations } from "next-intl";
import { getTranslations as getNextIntlTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import type messages from "../../messages/pl";

// Helper type to create dot-notation paths from nested objects, only for leaf values (not objects)
type DotNotation<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? T[K] extends unknown[]
      ? K // Arrays are treated as leaf values
      : `${K}.${DotNotation<T[K]>}` // Only return deeper paths, not the intermediate namespace
    : K // Primitive values are leaf values
  : never;

// All available translation keys as dot-notation paths
type AllTranslationKeys = DotNotation<typeof messages>;

// Helper type to get all possible namespace paths (including partial paths)
type NamespacePaths<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? T[K] extends unknown[]
      ? never
      : K | `${K}.${NamespacePaths<T[K]>}`
    : never
  : never;

// All available namespace paths
type ValidNamespaces = NamespacePaths<typeof messages> | "";

// Extract keys that start with a specific namespace
type ExtractNamespaceKeys<
  AllKeys extends string,
  Namespace extends string
> = AllKeys extends `${Namespace}.${infer Rest}` ? Rest : never;

// Type for namespace-scoped keys
type NamespaceKeys<T extends string> = T extends ""
  ? AllTranslationKeys
  : ExtractNamespaceKeys<AllTranslationKeys, T>;

// Type for namespace-scoped keys with validation
// If the namespace doesn't exist in ValidNamespaces, TypeScript will show an error
type TranslationKeys<T extends string> = T extends ValidNamespaces
  ? NamespaceKeys<T>
  : never;

// Type for translation interpolation values
type TranslationValues = Record<string, string | number | boolean | ReactNode>;

/**
 * Typed translation function interface that preserves all next-intl functionality
 */
type TypedTranslator<Namespace extends string = ""> = {
  (key: NamespaceKeys<Namespace>, values?: TranslationValues): string;

  rich(key: NamespaceKeys<Namespace>, values?: TranslationValues): ReactNode;

  raw(key: NamespaceKeys<Namespace>): string;

  // Additional properties that might exist on the original translator
  has(key: string): boolean;
  getPathname(href: string): string;
};

/**
 * Typed wrapper around next-intl's useTranslations hook
 * Provides full type safety and autocomplete for translation keys based on messages/pl.ts
 *
 * @example
 * ```tsx
 * // Global access to all keys
 * const t = useTranslations();
 * t("common.appName"); // ✅ Autocomplete works
 * t("pages.Auth.LoginPage.title"); // ✅ Autocomplete works
 *
 * // Namespace-scoped access
 * const authT = useTranslations("pages.Auth");
 * authT("LoginPage.title"); // ✅ Autocomplete for pages.Auth.* keys
 *
 * // Deep namespace
 * const loginT = useTranslations("pages.Auth.LoginPage");
 * loginT("title"); // ✅ Autocomplete for pages.Auth.LoginPage.* keys
 *
 * // With interpolation
 * const validationT = useTranslations("validation.user");
 * validationT("email.max", { max: 255 }); // ✅ With values
 * ```
 */
function useTranslations<T extends ValidNamespaces = "">(
  namespace?: T
): TypedTranslator<T> {
  // Use the original hook with string literal type
  const originalT = useNextIntlTranslations(namespace as string);

  const typedT = (key: string, values?: TranslationValues) => {
    // Use type assertion to bypass next-intl's restrictive typing
    return (originalT as (key: string, values?: TranslationValues) => string)(
      key,
      values
    );
  };

  typedT.rich = (key: string, values?: TranslationValues) => {
    return (
      originalT.rich as (key: string, values?: TranslationValues) => ReactNode
    )(key, values);
  };

  typedT.raw = (key: string) => {
    return (originalT.raw as (key: string) => string)(key);
  };

  // Add additional methods if they exist on the original
  typedT.has = (key: string) => {
    return "has" in originalT && typeof originalT.has === "function"
      ? (originalT.has as (key: string) => boolean)(key)
      : false;
  };

  typedT.getPathname = (href: string) => {
    return "getPathname" in originalT &&
      typeof originalT.getPathname === "function"
      ? (originalT.getPathname as (href: string) => string)(href)
      : href;
  };

  return typedT as TypedTranslator<T>;
}

/**
 * Typed wrapper around next-intl's getTranslations (server-side)
 * Provides the same typing benefits as useTranslations but for server components
 *
 * @example
 * ```tsx
 * // In server components or actions
 * const t = await getTypedTranslations();
 * const message = t("common.appName"); // ✅ Typed
 *
 * // With namespace
 * const authT = await getTypedTranslations("pages.Auth.LoginPage");
 * const title = authT("title"); // ✅ Typed
 * ```
 */
async function getTranslations<T extends ValidNamespaces = "">(
  namespace?: T
): Promise<TypedTranslator<T>> {
  const originalT = await getNextIntlTranslations(namespace as string);

  const typedT = (key: string, values?: TranslationValues) => {
    return (originalT as (key: string, values?: TranslationValues) => string)(
      key,
      values
    );
  };

  typedT.rich = (key: string, values?: TranslationValues) => {
    return (
      originalT.rich as (key: string, values?: TranslationValues) => ReactNode
    )(key, values);
  };

  typedT.raw = (key: string) => {
    return (originalT.raw as (key: string) => string)(key);
  };

  // Add additional methods if they exist on the original
  typedT.has = (key: string) => {
    return "has" in originalT && typeof originalT.has === "function"
      ? (originalT.has as (key: string) => boolean)(key)
      : false;
  };

  typedT.getPathname = (href: string) => {
    return "getPathname" in originalT &&
      typeof originalT.getPathname === "function"
      ? (originalT.getPathname as (href: string) => string)(href)
      : href;
  };

  return typedT as TypedTranslator<T>;
}

// translation with fallback

const defaultFallbackMessageKey =
  "common.error.messageKeyNotExisting" satisfies AllTranslationKeys;

/**
 * Typed wrapper around next-intl's useTranslations with fallback support (client-side)
 * Returns a translation function that automatically falls back to a default message if the key is missing or invalid.
 * Useful for safe rendering of translations without risk of undefined/null.
 *
 * @example
 * ```tsx
 * const t = useTranslationsWithFallback("common");
 * t("appName"); // ✅ Returns translation or fallback
 * t("nonExistingKey"); // ✅ Returns fallback message
 *
 * // With custom fallback key
 * const t2 = useTranslationsWithFallback("common", "common.error.general");
 * t2("nonExistingKey"); // ✅ Returns custom fallback
 * ```
 */
function useTranslationsWithFallback<T extends ValidNamespaces = "">(
  namespace?: T,
  fallbackMessageKey: AllTranslationKeys | undefined = defaultFallbackMessageKey
): (key: unknown, values?: TranslationValues) => string {
  const t = useTranslations(namespace);
  const fallbackT = useTranslations();

  return (key: unknown, values?: TranslationValues): string => {
    if (typeof key !== "string") {
      return fallbackT(fallbackMessageKey, values);
    }

    if (!t.has(key)) {
      return fallbackT(fallbackMessageKey, values);
    }

    return t(key as NamespaceKeys<T>, values);
  };
}

/**
 * Typed wrapper around next-intl's getTranslations with fallback support (server-side)
 * Returns an async translation function that automatically falls back to a default message if the key is missing or invalid.
 * Use in server components, actions, etc.
 *
 * @example
 * ```tsx
 * const t = await getTranslationsWithFallback("common");
 * t("appName"); // ✅ Returns translation or fallback
 * t("nonExistingKey"); // ✅ Returns fallback message
 *
 * // With custom fallback key
 * const t2 = await getTranslationsWithFallback("common", "common.error.general");
 * t2("nonExistingKey"); // ✅ Returns custom fallback
 * ```
 */
async function getTranslationsWithFallback<T extends ValidNamespaces = "">(
  namespace?: T,
  fallbackMessageKey: NamespaceKeys<""> | undefined = defaultFallbackMessageKey
): Promise<(key: unknown, values?: TranslationValues) => string> {
  const t = await getTranslations(namespace);
  const fallbackT = await getTranslations();

  return (key: unknown, values?: TranslationValues): string => {
    if (typeof key !== "string") {
      return fallbackT(fallbackMessageKey, values);
    }

    if (!t.has(key)) {
      return fallbackT(fallbackMessageKey, values);
    }

    return t(key as NamespaceKeys<T>, values);
  };
}

type TKeyOrMessage = AllTranslationKeys | string;

// ===== EXPORTS =====

export {
  useTranslations,
  getTranslations,
  useTranslationsWithFallback,
  getTranslationsWithFallback,
};
export type {
  TranslationKeys as ITranslationKey,
  AllTranslationKeys as TKey,
  TKeyOrMessage,
};
