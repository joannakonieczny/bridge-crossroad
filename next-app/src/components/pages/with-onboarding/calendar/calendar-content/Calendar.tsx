"use client";

import styles from "./calendar-overrides.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import plLocale from "@fullcalendar/core/locales/pl";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { Box, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { useLocale } from "next-intl";
import { useEventsForUserQuery } from "@/lib/queries";
import { useTranslations } from "@/lib/typed-translations";
import { useCallback, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import dayjs from "dayjs";
import "./calendar-overrides.module.css";
import type {
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventHoveringArg,
} from "@fullcalendar/core/index.js";

function getEventDayColor(
  eventStartDate: string | Date,
  eventEndDate: string | Date,
  isDark: boolean
) {
  const start = dayjs(eventStartDate).isValid()
    ? dayjs(eventStartDate).startOf("day")
    : null;
  const end = dayjs(eventEndDate).isValid()
    ? dayjs(eventEndDate).startOf("day")
    : null;
  if (!start || !end) return "var(--chakra-colors-accent-300)";

  const today = dayjs().startOf("day");

  if (start.isAfter(today) && end.isAfter(today)) {
    return "var(--chakra-colors-accent-300)";
  }
  if (
    (start.isBefore(today) || start.isSame(today)) &&
    (end.isAfter(today) || end.isSame(today))
  ) {
    return "var(--chakra-colors-secondary-300)";
  }
  return isDark ? "var(--chakra-colors-secondary-700)" : "var(--chakra-colors-gray-300)";
}

const COLOR_HOVER_MAPPINGS = [
  {
    match: "--chakra-colors-secondary-300",
    to: "var(--chakra-colors-secondary-500)",
  },
  {
    match: "secondary-300",
    to: "var(--chakra-colors-secondary-500)",
  },
  {
    match: "--chakra-colors-secondary-700",
    to: "var(--chakra-colors-secondary-800)",
  },
  {
    match: "secondary-700",
    to: "var(--chakra-colors-secondary-800)",
  },
  {
    match: "--chakra-colors-accent-300",
    to: "var(--chakra-colors-accent-500)",
  },
  { match: "accent-300", to: "var(--chakra-colors-accent-500)" },
  {
    match: "--chakra-colors-border-300",
    to: "var(--chakra-colors-border-500)",
  },
  { match: "border-300", to: "var(--chakra-colors-border-500)" },
];

export default function Calendar() {
  const t = useTranslations("common.eventType");
  const locale = useLocale();
  const calendarRef = useRef<FullCalendar>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const router = useRouter();
  const pathname = usePathname();

  const showSingleDay = useBreakpointValue({ base: true, md: false }) ?? false;
  const initialView = showSingleDay ? "timeGridDay" : "timeGridWeek";

  const now = dayjs();
  let initialStart: Date;
  let initialEnd: Date;
  if (initialView === "timeGridDay") {
    initialStart = now.startOf("day").toDate();
    initialEnd = dayjs(initialStart).add(1, "day").toDate();
  } else {
    const day = now.day();
    const diffToMonday = (day + 6) % 7;
    initialStart = now.subtract(diffToMonday, "day").startOf("day").toDate();
    initialEnd = dayjs(initialStart).add(7, "day").toDate();
  }

  const [visibleRange, setVisibleRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: initialStart,
    end: initialEnd,
  });

  const eventsQ = useEventsForUserQuery(
    {
      start: visibleRange.start!,
      end: visibleRange.end!,
    },
    {
      enabled: visibleRange.start !== null && visibleRange.end !== null,
    }
  );

  const events = eventsQ.data?.events ?? [];

  const rawEvents = events.map((e) => ({
    title: e.title,
    start: e.duration.startsAt,
    end: e.duration.endsAt,
    extendedProps: {
      description: e.description,
      eventType: e.data?.type,
      id: e.id,
    },
  }));

  const eventsWithColor = rawEvents.map((e) => ({
    ...e,
    color: getEventDayColor(e.start, e.end, isDark),
    textColor: "bg",
  }));

  const fcLocales = locale === "pl" ? [plLocale] : [enLocale];
  const fcLocale = locale === "pl" ? "pl" : "en-gb";

  const handleDatesSet = useCallback(
    (arg: DatesSetArg) => {
      const newStart = arg.start ? arg.start.getTime() : null;
      const newEnd = arg.end ? arg.end.getTime() : null;
      const curStart = visibleRange.start ? visibleRange.start.getTime() : null;
      const curEnd = visibleRange.end ? visibleRange.end.getTime() : null;
      if (newStart !== curStart || newEnd !== curEnd) {
        setVisibleRange({ start: arg.start ?? null, end: arg.end ?? null });
        console.debug(
          "visible range:",
          arg.start,
          arg.end,
          "view:",
          arg.view?.type
        );
      }
    },
    [visibleRange]
  );

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      router.push(`${pathname}/${info.event.extendedProps.id}`);
    },
    [pathname, router]
  );

  const handleEventMouseEnter = useCallback((info: EventHoveringArg) => {
    try {
      const el = info?.el as HTMLElement | undefined;
      if (!el) return;

      if (el.dataset.fcOrigBg === undefined)
        el.dataset.fcOrigBg = el.style.backgroundColor || "";

      const inlineBg = el.style.backgroundColor || "";
      const compBg = getComputedStyle(el).backgroundColor || "";
      const bgToCheck = inlineBg || compBg || "";

      for (const m of COLOR_HOVER_MAPPINGS) {
        if (bgToCheck.includes(m.match)) {
          el.style.transition = "background-color 140ms ease-in-out";
          el.style.backgroundColor = m.to;
          break;
        }
      }
    } catch {}
  }, []);

  const handleEventMouseLeave = useCallback((info: EventHoveringArg) => {
    try {
      const el = info?.el as HTMLElement | undefined;
      if (!el) return;
      if (el.dataset.fcOrigBg !== undefined) {
        el.style.backgroundColor = el.dataset.fcOrigBg;
      }
      el.style.transition = "background-color 140ms ease-in-out";
    } catch {}
  }, []);

  const renderEventContent = useCallback(
    (arg: EventContentArg) => {
      const ev = arg.event;
      const type = ev.extendedProps?.eventType;

      const startDate: Date | null = ev.start ?? null;
      const endDate: Date | null = ev.end ?? ev.start ?? null;
      const isMultiDay =
        startDate &&
        endDate &&
        (startDate.getFullYear() !== endDate.getFullYear() ||
          startDate.getMonth() !== endDate.getMonth() ||
          startDate.getDate() !== endDate.getDate());

      const formatDateTime = (d: Date) =>
        d.toLocaleString(fcLocale, {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

      return (
        <div
          className="fc-event-content-custom"
          style={{ display: "flex", flexDirection: "column", gap: "2px" }}
        >
          {arg.timeText && !isMultiDay && (
            <div style={{ fontSize: "0.85em", opacity: 0.9 }}>
              {arg.timeText}
            </div>
          )}
          {isMultiDay && startDate && endDate && (
            <div style={{ fontSize: "0.8em", opacity: 0.9 }}>
              {formatDateTime(startDate)} — {formatDateTime(endDate)}
            </div>
          )}
          <div style={{ fontWeight: 700, fontSize: "0.95em", lineHeight: 1 }}>
            {ev.title}
          </div>
          {type && (
            <div
              style={{
                fontStyle: "italic",
                fontSize: "0.75em",
                opacity: 0.9,
              }}
            >
              {t(type)}
            </div>
          )}
        </div>
      );
    },
    [fcLocale, t]
  );

  return (
    <Box className={styles.root} overflowY="auto" p={4}>
      <FullCalendar
        ref={calendarRef}
        datesSet={handleDatesSet}
        key={initialView}
        plugins={[dayGridPlugin, timeGridPlugin]}
        locales={fcLocales}
        locale={fcLocale}
        firstDay={1}
        themeSystem="bootstrap"
        initialView={initialView}
        weekends={true}
        events={eventsWithColor}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        scrollTime="06:00:00"
        allDaySlot={false}
        height="calc(100vh - 12rem)"
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />
    </Box>
  );
}
