import z from "zod";
import {
  academySchema,
  yearOfBirthSchema,
} from "@/schemas/model/user/user-schema";
import type { ValidNamespaces } from "@/lib/typed-translations";

export const onboardingFirstPageSchema = z.object({
  academy: z
    .string()
    .nonempty(
      "validation.pages.onboarding.firstPage.academy.required" as ValidNamespaces
    )
    .pipe(academySchema),
  yearOfBirth: z
    .string()
    .nonempty(
      "validation.pages.onboarding.firstPage.yearOfBirth.required" as ValidNamespaces
    )
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error(
          "validation.pages.onboarding.firstPage.yearOfBirth.invalid" as ValidNamespaces
        );
      }
      return parsed;
    })
    .pipe(yearOfBirthSchema),
});

export type OnboardingFirstPageType = z.infer<typeof onboardingFirstPageSchema>;
