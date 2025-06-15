import z from "zod";
import { UserOnboardingSchemaProvider } from "@/schemas/user";
import { useTranslations } from "next-intl";

export function OnboardingFirstPageSchemaProvider() {
  const { academySchema, yearOfBirthSchema } = UserOnboardingSchemaProvider();
  const t = useTranslations("OnboardingPage.firstPage");
  const formSchema = z.object({
    academy: z.string().min(1, t("academy.noneSelected")).pipe(academySchema),
    yearOfBirth: z
      .string()
      .min(1, t("yearOfBirth.noneSelected"))
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error(t("yearOfBirth.noneSelected"));
        }
        return parsed;
      })
      .pipe(yearOfBirthSchema),
  });
  return {
    formSchema,
  };
}

export type OnboardingFirstPageSchema = z.infer<
  ReturnType<typeof OnboardingFirstPageSchemaProvider>["formSchema"]
>;
