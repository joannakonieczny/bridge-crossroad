import { z } from "zod";
import {
  onboardingFirstPageSchema,
  onboardingSecondPageSchema,
  onboardingThirdPageSchema,
  onboardingFinalPageSchema,
} from "./onboarding-schema";

export type OnboardingFirstPageType = z.infer<typeof onboardingFirstPageSchema>;

export type OnboardingSecondPageType = z.infer<
  typeof onboardingSecondPageSchema
>;

export type OnboardingThirdPageType = z.infer<typeof onboardingThirdPageSchema>;

export type OnboardingFinalPageType = z.infer<typeof onboardingFinalPageSchema>;
