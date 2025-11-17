import { z } from "zod";

export function isProbablyEmail(value: string) {
  return value.includes("@");
}

export const idPropSchema = z.string().nonempty();

export const withTimeStampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export function allEmptyStringsToUndefined<S extends z.ZodTypeAny>(schema: S) {
  return z
    .any()
    .transform((value: unknown) => {
      function transform(input: unknown): unknown {
        if (input === "") return undefined;
        if (input instanceof Date) return input;

        if (Array.isArray(input)) {
          return input.map(transform);
        }

        if (typeof input === "object" && input !== null) {
          const obj: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(input)) {
            obj[k] = transform(v);
          }
          return obj;
        }

        return input;
      }

      return transform(value);
    })
    .pipe(schema);
}
