import type { DurationType } from "@/schemas/common";
import dayjs from "dayjs";
import "dayjs/locale/pl";

dayjs.locale("pl");

type Person = {
  nickname?: string;
  name: { firstName: string; lastName: string };
};

export function getPersonLabel(person?: Person) {
  if (!person) return "-";
  return person.nickname
    ? `${person.name.firstName} ${person.name.lastName} (${person.nickname})`
    : `${person.name.firstName} ${person.name.lastName}`;
}

export function getDurationLabel(duration?: DurationType) {
  if (!duration) return "-";
  const s = dayjs(duration.startsAt);
  const e = dayjs(duration.endsAt);
  const now = dayjs();

  // show year only if different than current year
  const showYear = (d: dayjs.Dayjs) => (d.year() !== now.year() ? " YYYY" : "");

  if (s.isSame(e, "day")) {
    return `${s.format(`ddd, D MMM${showYear(s)}, HH:mm`)} – ${e.format(
      "HH:mm"
    )}`;
  }

  return `${s.format(`ddd, D MMM${showYear(s)}, HH:mm`)} – ${e.format(
    `ddd, D MMM${showYear(e)}, HH:mm`
  )}`;
}

export function getDateLabel(d?: Date) {
  if (!d) return "-";
  const day = dayjs(d);
  const showYear = day.year() !== dayjs().year() ? " YYYY" : "";
  return day.format(`ddd, D MMM${showYear}`);
}
