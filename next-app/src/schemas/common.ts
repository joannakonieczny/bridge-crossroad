import type { TKey } from "@/lib/typed-translations";
import { z } from "zod";

export function isProbablyEmail(value: string) {
  return value.includes("@");
}

export const idPropSchema = z.string().nonempty();
export const idPropSchemaM = (m: string) =>
  z.string({ message: m }).nonempty({ message: m });

export const withTimeStampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const durationSchema = z
  .object({
    startsAt: z.date(),
    endsAt: z.date(),
  })
  .refine((d) => d.startsAt < d.endsAt, {
    message: "validation.common.duration.invalid" satisfies TKey,
    path: ["endsAt"],
  });

export type DurationType = z.infer<typeof durationSchema>;

export const emptyStringToUndefinedOnObject = (value: unknown) => {
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
};

export function emptyToUndefined<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (v: unknown) => (v === "" ? undefined : v),
    schema.optional()
  ) as z.ZodEffects<z.ZodType<z.input<T> | undefined>, z.output<T> | undefined>;
}

export function withEmptyToUndefined<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(emptyStringToUndefinedOnObject, schema) as z.ZodEffects<
    z.ZodType<z.input<T>>,
    z.output<T>
  >;
}
