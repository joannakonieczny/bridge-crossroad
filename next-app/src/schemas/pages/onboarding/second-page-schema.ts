import z from "zod";
import { UserOnboardingSchemaProvider } from "@/schemas/model/user/user-schema";
import { useTranslations } from "next-intl";

// client only
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
          message: t("startPlayingDate.required"),
        })
        .pipe(startPlayingDateSchema),

      z
        .string()
        .nonempty(t("startPlayingDate.required"))
        .transform((val) => {
          try {
            const parsedDate = new Date(val);
            if (isNaN(parsedDate.getTime())) {
              throw new Error(t("startPlayingDate.required"));
            }
            return parsedDate;
          } catch {
            throw new Error(t("startPlayingDate.required"));
          }
        })
        .pipe(startPlayingDateSchema),
    ]),

    trainingGroup: z
      .string()
      .nonempty(t("skillLevel.required"))
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
