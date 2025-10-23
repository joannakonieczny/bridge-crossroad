import type { z } from "zod";
import type * as s from "./onboarding-schema";

export type OnboardingFirstPageType = z.infer<
  typeof s.onboardingFirstPageSchema
>;

export type OnboardingSecondPageType = z.infer<
  typeof s.onboardingSecondPageSchema
>;

export type OnboardingThirdPageType = z.infer<
  typeof s.onboardingThirdPageSchema
>;

export type OnboardingFinalPageType = z.infer<
  typeof s.onboardingFinalPageSchema
>;
