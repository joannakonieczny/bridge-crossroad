import { useTranslations } from "next-intl";
import z from "zod";

export const inviteCodeLength = 8;

export function OnboardingFinalPageSchemaProvider() {
  const t = useTranslations("validation.onboarding");
  const inviteCodeSchema = z
    .string()
    .regex(/^[A-Z0-9]{8}$/, t("inviteCode.invalid"));

  const termsAcceptedSchema = z.boolean();

  const formSchema = z
    .object({
      inviteCode: inviteCodeSchema,
      termsAccepted: termsAcceptedSchema,
    })
    .refine((data) => data.termsAccepted, {
      message: t("termsAccepted.required"),
    });

  return {
    formSchema,
    inviteCodeSchema,
    termsAcceptedSchema,
  };
}

export type OnboardingFinalPageSchema = z.infer<
  ReturnType<typeof OnboardingFinalPageSchemaProvider>["formSchema"]
>;
