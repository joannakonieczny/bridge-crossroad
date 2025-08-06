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
} from "@/schemas/model/user/user-schema";
import { emptyStringToUndefined } from "@/schemas/common";
import type { ValidNamespaces } from "@/lib/typed-translations";

export const InviteCodeValidationConstants = {
  inviteCodeLength: 8,
  inviteCodeRegex: /^[A-Z0-9]{8}$/,
};

// First Page Schema
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

// Second Page Schema
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

// Third Page Schema
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

// Final Page Schema
const inviteCodeSchema = z
  .string()
  .regex(
    InviteCodeValidationConstants.inviteCodeRegex,
    "validation.pages.onboarding.finalPage.inviteCode.regex" as ValidNamespaces
  );

const termsAcceptedSchema = z.boolean();

export const onboardingFinalPageSchema = z
  .object({
    inviteCode: z
      .string()
      .nonempty(
        "validation.pages.onboarding.finalPage.inviteCode.required" as ValidNamespaces
      )
      .pipe(inviteCodeSchema),
    termsAccepted: termsAcceptedSchema,
  })
  .refine((data) => data.termsAccepted, {
    message:
      "validation.pages.onboarding.finalPage.terms.errorMessage" as ValidNamespaces,
  });
