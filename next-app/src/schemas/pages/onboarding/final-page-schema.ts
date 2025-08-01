import { z } from "zod";
import type { ValidNamespaces } from "@/lib/typed-translations";

export const InviteCodeValidationConstants = {
  inviteCodeLength: 8,
  inviteCodeRegex: /^[A-Z0-9]{8}$/,
};

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

export type OnboardingFinalPageType = z.infer<typeof onboardingFinalPageSchema>;
