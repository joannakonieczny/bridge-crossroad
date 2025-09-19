import { z } from "zod";

export function emptyStringToUndefined(value: string | undefined) {
  return value === "" ? undefined : value;
}

export type TranslationFunction = ReturnType<
  typeof import("next-intl").useTranslations
>;

export function isProbablyEmail(value: string) {
  return value.includes("@");
}

export const idPropSchema = z.string().nonempty();
