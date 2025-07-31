import z from "zod";
import {
  academySchema,
  yearOfBirthSchema,
} from "@/schemas/model/user/user-schema";
import { useTranslations } from "next-intl";

// client only
export function OnboardingFirstPageSchemaProvider() {
  const t = useTranslations("OnboardingPage.firstPage");
  const formSchema = z.object({
    academy: z.string().nonempty(t("academy.required")).pipe(academySchema),
    yearOfBirth: z
      .string()
      .nonempty(t("yearOfBirth.required"))
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error(t("yearOfBirth.required"));
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
