import z from "zod";
import { UserOnboardingSchemaProvider } from "@/schemas/user";

export function OnboardingSecondPageSchemaProvider() {
  const {
    startPlayingDateSchema,
    trainingGroupSchema,
    hasRefereeLicenseSchema,
  } = UserOnboardingSchemaProvider();

  const formSchema = z.object({
    startPlayingDate: startPlayingDateSchema,
    trainingGroup: trainingGroupSchema,
    hasRefereeLicense: hasRefereeLicenseSchema,
  });

  return {
    formSchema,
  };
}

export type OnboardingSecondPageSchema = z.infer<
  ReturnType<typeof OnboardingSecondPageSchemaProvider>["formSchema"]
>;
