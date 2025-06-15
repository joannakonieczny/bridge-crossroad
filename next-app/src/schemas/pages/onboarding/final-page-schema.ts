import { useTranslations } from "next-intl";
import z from "zod";

export const InviteCodeValidationConstants = {
  inviteCodeLength: 8,
  inviteCodeRegex: /^[A-Z0-9]{8}$/,
};

// client only
export function OnboardingFinalPageSchemaProvider() {
  const t = useTranslations("OnboardingPage.finalPage");
  const inviteCodeSchema = z
    .string()
    .regex(
      InviteCodeValidationConstants.inviteCodeRegex,
      t("inviteCode.regex")
    );

  const termsAcceptedSchema = z.boolean();

  const formSchema = z
    .object({
      inviteCode: z
        .string()
        .nonempty(t("inviteCode.required"))
        .pipe(inviteCodeSchema),
      termsAccepted: termsAcceptedSchema,
    })
    .refine((data) => data.termsAccepted, {
      message: t("terms.errorMessage"),
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
