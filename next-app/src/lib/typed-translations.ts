import { useTranslations as useNextIntlTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";

// Import the messages object and its type
import messages from "../../messages/pl";
import type { IAppMessagesForLanguage } from "../../messages/pl";

// Helper type to create dot-notation paths from nested objects
type DotNotation<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? T[K] extends unknown[]
      ? K
      : K | `${K}.${DotNotation<T[K]>}`
    : K
  : never;

// All available translation keys as dot-notation paths
export type TranslationKeys = DotNotation<typeof messages>;

// Helper type to get all possible namespace paths (including partial paths)
type NamespacePaths<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? T[K] extends unknown[]
      ? never
      : K | `${K}.${NamespacePaths<T[K]>}`
    : never
  : never;

// All available namespace paths
export type ValidNamespaces = NamespacePaths<typeof messages> | "";

// Extract keys that start with a specific namespace
type ExtractNamespaceKeys<
  AllKeys extends string,
  Namespace extends string
> = AllKeys extends `${Namespace}.${infer Rest}` ? Rest : never;

// Type for namespace-scoped keys
type NamespaceKeys<T extends string> = T extends ""
  ? TranslationKeys
  : ExtractNamespaceKeys<TranslationKeys, T>;

// Type for translation interpolation values
type TranslationValues = Record<
  string,
  string | number | boolean | React.ReactNode
>;

/**
 * Typed translation function interface that preserves all next-intl functionality
 */
interface TypedTranslator<Namespace extends string = ""> {
  (key: NamespaceKeys<Namespace>, values?: TranslationValues): string;

  rich(
    key: NamespaceKeys<Namespace>,
    values?: TranslationValues
  ): React.ReactNode;

  raw(key: NamespaceKeys<Namespace>): string;

  // Additional properties that might exist on the original translator
  has(key: string): boolean;
  getPathname(href: string): string;
}

/**
 * Typed wrapper around next-intl's useTranslations hook
 * Provides full type safety and autocomplete for translation keys based on messages/pl.ts
 *
 * @example
 * ```tsx
 * // Global access to all keys
 * const t = useTranslations();
 * t("common.appName"); // ✅ Autocomplete works
 * t("Auth.LoginPage.title"); // ✅ Autocomplete works
 *
 * // Namespace-scoped access
 * const authT = useTranslations("Auth");
 * authT("LoginPage.title"); // ✅ Autocomplete for Auth.* keys
 *
 * // Deep namespace
 * const loginT = useTranslations("Auth.LoginPage");
 * loginT("title"); // ✅ Autocomplete for Auth.LoginPage.* keys
 *
 * // With interpolation
 * const validationT = useTranslations("validation.user");
 * validationT("email.max", { max: 255 }); // ✅ With values
 * ```
 */
export function useTranslations<T extends ValidNamespaces = "">(
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
      originalT.rich as (
        key: string,
        values?: TranslationValues
      ) => React.ReactNode
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
 * const authT = await getTypedTranslations("Auth.LoginPage");
 * const title = authT("title"); // ✅ Typed
 * ```
 */
export async function getTypedTranslations<T extends ValidNamespaces = "">(
  namespace?: T
): Promise<TypedTranslator<T>> {
  const originalT = await getTranslations(namespace as string);

  const typedT = (key: string, values?: TranslationValues) => {
    return (originalT as (key: string, values?: TranslationValues) => string)(
      key,
      values
    );
  };

  typedT.rich = (key: string, values?: TranslationValues) => {
    return (
      originalT.rich as (
        key: string,
        values?: TranslationValues
      ) => React.ReactNode
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
 * Utility type to extract all available top-level namespaces
 */
export type AvailableNamespaces = keyof typeof messages;

/**
 * Type helper to check if a string is a valid translation key
 */
export const isTranslationKey = (key: string): key is TranslationKeys => {
  // This is primarily for TypeScript - runtime validation would need implementation
  return typeof key === "string";
};

/**
 * Type for extracting the type of a translation value at a given key path
 */
export type TranslationValue = string;

/**
 * Type guard to check if a key is a valid translation key (runtime check)
 */
export function isValidTranslationKey(key: string): key is TranslationKeys {
  // This is a runtime check - you could implement validation logic here
  // For now, we'll assume any string could be valid
  return typeof key === "string";
}

/**
 * Helper to get all available keys for a namespace (useful for debugging)
 * Note: This returns an empty array at runtime but provides correct typing
 *
 * @example
 * ```typescript
 * const keys = getNamespaceKeys<"Auth">();
 * // keys will have type ExtractNamespaceKeys<TranslationKeys, "Auth">[]
 * ```
 */
export function getNamespaceKeys<
  T extends AvailableNamespaces
>(): ExtractNamespaceKeys<TranslationKeys, T>[] {
  // This would need runtime implementation to actually extract keys
  // For TypeScript, the return type is what matters for autocomplete
  return [] as ExtractNamespaceKeys<TranslationKeys, T>[];
}

/**
 * Re-export the messages object for convenience
 */
export { messages };

/**
 * Re-export the type for external usage
 */
export type { IAppMessagesForLanguage };
