import { useTranslations } from "@/lib/typed-translations";

export function useGetMonths() {
  const t = useTranslations("common.date.months");
  return [
    t("jan"),
    t("feb"),
    t("mar"),
    t("apr"),
    t("may"),
    t("jun"),
    t("jul"),
    t("aug"),
    t("sep"),
    t("oct"),
    t("nov"),
    t("dec"),
  ];
}
