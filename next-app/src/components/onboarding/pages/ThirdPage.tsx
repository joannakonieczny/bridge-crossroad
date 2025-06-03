import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";

export default function ThirdPage() {
  const t = useTranslations("OnboardingPage.thirdPage");
  return (
    <PagesLayout
      mainHeading={{
        text: t("mainHeading.text"),
        highlight: {
          query: t("mainHeading.highlight"),
        },
      }}
      subHeading={{ text: t("subHeading") }}
    >
      ThirdPage
    </PagesLayout>
  );
}
