import z from "zod";
import { UserOnboardingSchemaProvider } from "@/schemas/user";
import { useTranslations } from "next-intl";

export function OnboardingSecondPageSchemaProvider() {
  const {
    startPlayingDateSchema,
    trainingGroupSchema,
    hasRefereeLicenseSchema,
  } = UserOnboardingSchemaProvider();
  const t = useTranslations("OnboardingPage.secondPage");

  const formSchema = z.object({
    startPlayingDate: z.union([
      z
        .instanceof(Date, {
          message: t("monthYear.noneSelected"),
        })
        .pipe(startPlayingDateSchema),

      z
        .string()
        .min(1, t("monthYear.noneSelected"))
        .transform((val) => {
          try {
            const parsedDate = new Date(val);
            if (isNaN(parsedDate.getTime())) {
              throw new Error(t("monthYear.noneSelected"));
            }
            return parsedDate;
          } catch {
            throw new Error(t("monthYear.noneSelected"));
          }
        })
        .pipe(startPlayingDateSchema),
    ]),

    trainingGroup: z
      .string()
      .min(1, t("skillLevel.noneSelected"))
      .pipe(trainingGroupSchema),

    hasRefereeLicense: hasRefereeLicenseSchema,
  });

  return {
    formSchema,
  };
}

export type OnboardingSecondPageSchema = z.infer<
  ReturnType<typeof OnboardingSecondPageSchemaProvider>["formSchema"]
>;
