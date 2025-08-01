import z from "zod";
import {
  startPlayingDateSchema,
  trainingGroupSchema,
  hasRefereeLicenseSchema,
} from "@/schemas/model/user/user-schema";
import type { ValidNamespaces } from "@/lib/typed-translations";

export const onboardingSecondPageSchema = z.object({
  startPlayingDate: z.union([
    z
      .instanceof(Date, {
        message:
          "validation.pages.onboarding.secondPage.startPlayingDate.required" as ValidNamespaces,
      })
      .pipe(startPlayingDateSchema),

    z
      .string()
      .nonempty(
        "validation.pages.onboarding.secondPage.startPlayingDate.required" as ValidNamespaces
      )
      .transform((val) => {
        try {
          const parsedDate = new Date(val);
          if (isNaN(parsedDate.getTime())) {
            throw new Error(
              "validation.pages.onboarding.secondPage.startPlayingDate.invalid" as ValidNamespaces
            );
          }
          return parsedDate;
        } catch {
          throw new Error(
            "validation.pages.onboarding.secondPage.startPlayingDate.invalid" as ValidNamespaces
          );
        }
      })
      .pipe(startPlayingDateSchema),
  ]),

  trainingGroup: z
    .string()
    .nonempty(
      "validation.pages.onboarding.secondPage.trainingGroup.required" as ValidNamespaces
    )
    .pipe(trainingGroupSchema),

  hasRefereeLicense: hasRefereeLicenseSchema,
});

export type OnboardingSecondPageType = z.infer<
  typeof onboardingSecondPageSchema
>;
