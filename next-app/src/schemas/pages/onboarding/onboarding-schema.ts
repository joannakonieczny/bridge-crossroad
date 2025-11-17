import { z } from "zod";
import {
  academySchema,
  yearOfBirthSchema,
  startPlayingDateSchema,
  trainingGroupSchema,
  hasRefereeLicenseSchema,
  cezarIdSchema,
  bboIdSchema,
  cuebidsIdSchema,
  onboardingDataSchema,
} from "@/schemas/model/user/user-schema";
import { allEmptyStringsToUndefined } from "@/schemas/common";
import { invitationCodeSchema } from "@/schemas/model/group/group-schema";
import type { TKey } from "@/lib/typed-translations";

// First Page Schema
export const onboardingFirstPageSchema = z.object({
  academy: z
    .string({
      message:
        "validation.pages.onboarding.firstPage.academy.required" satisfies TKey,
    })
    .nonempty(
      "validation.pages.onboarding.firstPage.academy.required" satisfies TKey
    )
    .pipe(academySchema),
  yearOfBirth: z
    .string({
      message:
        "validation.pages.onboarding.firstPage.yearOfBirth.required" satisfies TKey,
    })
    .nonempty(
      "validation.pages.onboarding.firstPage.yearOfBirth.required" satisfies TKey
    )
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error(
          "validation.pages.onboarding.firstPage.yearOfBirth.invalid" satisfies TKey
        );
      }
      return parsed;
    })
    .pipe(yearOfBirthSchema),
});

// Second Page Schema
export const onboardingSecondPageSchema = z.object({
  startPlayingDate: z.union([
    z
      .instanceof(Date, {
        message:
          "validation.pages.onboarding.secondPage.startPlayingDate.required" satisfies TKey,
      })
      .pipe(startPlayingDateSchema),

    z
      .string({
        message:
          "validation.pages.onboarding.secondPage.startPlayingDate.required" satisfies TKey,
      })
      .nonempty(
        "validation.pages.onboarding.secondPage.startPlayingDate.required" satisfies TKey
      )
      .transform((val) => {
        try {
          const parsedDate = new Date(val);
          if (isNaN(parsedDate.getTime())) {
            throw new Error(
              "validation.pages.onboarding.secondPage.startPlayingDate.invalid" satisfies TKey
            );
          }
          return parsedDate;
        } catch {
          throw new Error(
            "validation.pages.onboarding.secondPage.startPlayingDate.invalid" satisfies TKey
          );
        }
      })
      .pipe(startPlayingDateSchema),
  ]),

  trainingGroup: z
    .string({
      message:
        "validation.pages.onboarding.secondPage.trainingGroup.required" satisfies TKey,
    })
    .nonempty(
      "validation.pages.onboarding.secondPage.trainingGroup.required" satisfies TKey
    )
    .pipe(trainingGroupSchema),

  hasRefereeLicense: hasRefereeLicenseSchema,
});

// Third Page Schema
export const onboardingThirdPageSchema = allEmptyStringsToUndefined(
  z.object({
    cezarId: cezarIdSchema.optional(),
    bboId: bboIdSchema.optional(),
    cuebidsId: cuebidsIdSchema.optional(),
  })
);

// Final Page Schema

const termsAcceptedSchema = z.boolean();

export const onboardingFinalPageSchema = z
  .object({
    inviteCode: invitationCodeSchema,
    termsAccepted: termsAcceptedSchema,
  })
  .refine((data) => data.termsAccepted, {
    message:
      "validation.pages.onboarding.finalPage.terms.errorMessage" satisfies TKey,
  });

// API
export const completeOnboardingAndJoinMainGroupSchema =
  onboardingDataSchema.extend({
    inviteCode: invitationCodeSchema,
  });
