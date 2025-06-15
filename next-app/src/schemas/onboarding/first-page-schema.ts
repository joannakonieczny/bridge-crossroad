import z from "zod";
import { UserOnboardingSchemaProvider } from "@/schemas/user";

export function OnboardingFirstPageSchemaProvider() {
  const { academySchema, yearOfBirthSchema } = UserOnboardingSchemaProvider();
  const formSchema = z.object({
    academy: academySchema,
    yearOfBirth: yearOfBirthSchema,
  });
  return {
    formSchema,
  };
}

export type OnboardingFirstPageSchema = z.infer<
  ReturnType<typeof OnboardingFirstPageSchemaProvider>["formSchema"]
>;
