import { z } from "zod";

export function emptyStringToUndefined(value: string | undefined) {
  return value === "" ? undefined : value;
}

export function isProbablyEmail(value: string) {
  return value.includes("@");
}

export const idPropSchema = z.string().nonempty();

export const withTimeStampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export function transformEmptyStringsToUndefined<T extends z.ZodTypeAny>(
  schema: T
) {
  return z
    .any()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(schema)
    .optional();
}
