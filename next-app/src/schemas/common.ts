export const emptyStringToUndefined = (value: string | undefined) =>
  value === "" ? undefined : value;

export type TranslationFunction = ReturnType<
  typeof import("next-intl").useTranslations
>;
