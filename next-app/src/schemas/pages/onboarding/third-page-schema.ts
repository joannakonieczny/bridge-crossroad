import { z } from "zod";
import {
  cezarIdSchema,
  bboIdSchema,
  cuebidsIdSchema,
} from "@/schemas/model/user/user-schema";
import { emptyStringToUndefined } from "@/schemas/common";

export const onboardingThirdPageSchema = z.object({
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

export type OnboardingThirdPageType = z.infer<typeof onboardingThirdPageSchema>;
