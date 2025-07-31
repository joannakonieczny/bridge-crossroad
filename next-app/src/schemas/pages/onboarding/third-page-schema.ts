import z from "zod";
import {
  cezarIdSchema,
  bboIdSchema,
  cuebidsIdSchema,
} from "@/schemas/model/user/user-schema";
import { emptyStringToUndefined } from "@/schemas/common";

// client only
export function OnboardingThirdPageSchemaProvider() {
  const formSchema = z.object({
    cezarId: z
      .string()
      .transform(emptyStringToUndefined)
      .pipe(cezarIdSchema.optional()),
    bboId: z
      .string()
      .transform(emptyStringToUndefined)
      .pipe(bboIdSchema.optional()),
    cuebidsId: z
      .string()
      .transform(emptyStringToUndefined)
      .pipe(cuebidsIdSchema.optional()),
  });

  return {
    formSchema,
  };
}

export type OnboardingThirdPageSchema = z.infer<
  ReturnType<typeof OnboardingThirdPageSchemaProvider>["formSchema"]
>;
