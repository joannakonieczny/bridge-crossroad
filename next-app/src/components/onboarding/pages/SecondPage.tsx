import * as React from "react";
import PagesLayout from "./PagesLayout";
import { useTranslations } from "next-intl";

export default function SecondPage() {
  const t = useTranslations("OnboardingPage.secondPage");

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
      SecondPage
    </PagesLayout>
  );
}
