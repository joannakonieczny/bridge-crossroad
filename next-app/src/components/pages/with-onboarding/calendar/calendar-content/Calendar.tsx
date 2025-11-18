"use client";

import styles from "./calendar-overrides.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import plLocale from "@fullcalendar/core/locales/pl";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { useLocale } from "next-intl";
import { useEventsForUserQuery } from "@/lib/queries";
import { useTranslations } from "@/lib/typed-translations";
import { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "./calendar-overrides.module.css";
import type { DatesSetArg, EventContentArg } from "@fullcalendar/core/index.js";

function getEventDayColor(
  eventStartDate: string | Date,
  eventEndDate: string | Date
) {
  const startDate =
    typeof eventStartDate === "string"
      ? new Date(eventStartDate)
      : eventStartDate;
  if (Number.isNaN(startDate.getTime()))
    return "var(--chakra-colors-accent-300)";

  const endDate =
    typeof eventEndDate === "string" ? new Date(eventEndDate) : eventEndDate;
  if (Number.isNaN(endDate.getTime())) return "var(--chakra-colors-accent-300)";

  const eventStart = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const eventEnd = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (
    eventStart.getTime() > todayDate.getTime() &&
    eventEnd.getTime() > todayDate.getTime()
  ) {
    //future
    return "var(--chakra-colors-accent-300)";
  } else if (
    eventStart.getTime() <= todayDate.getTime() &&
    eventEnd.getTime() >= todayDate.getTime()
  ) {
    //today
    return "var(--chakra-colors-secondary-300)";
  } else {
    //past
    return "var(--chakra-colors-border-300)";
  }
}

export default function Calendar() {
  const t = useTranslations("common.eventType");
  const locale = useLocale();
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();
  const pathname = usePathname();

  // determine initial view (mobile = single day)
  const showSingleDay = useBreakpointValue({ base: true, md: false }) ?? false;
  const initialView = showSingleDay ? "timeGridDay" : "timeGridWeek";

  // compute initial visible range for the initialView (mirrors FullCalendar's activeStart/activeEnd)
  const today = new Date();
  let initialStart: Date;
  let initialEnd: Date;
  if (initialView === "timeGridDay") {
    initialStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    initialEnd = new Date(initialStart);
    initialEnd.setDate(initialEnd.getDate() + 1); // exclusive end (one day)
  } else {
    // week view, firstDay = 1 (Monday)
    const day = today.getDay(); // 0..6 (Sun..Sat)
    const diffToMonday = (day + 6) % 7; // 0 if Monday, 6 if Sunday
    initialStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - diffToMonday
    );
    initialEnd = new Date(initialStart);
    initialEnd.setDate(initialEnd.getDate() + 7); // exclusive end (one week)
  }

  const [visibleRange, setVisibleRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: initialStart,
    end: initialEnd,
  });

  // visibleRange is initialized to the calendar's initial visible start/end,
  // so we can call the query directly without fallback sentinels.
  const eventsQ = useEventsForUserQuery({
    start: visibleRange.start!,
    end: visibleRange.end!,
  });

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
    color: getEventDayColor(e.start, e.end),
    textColor: "bg",
  }));

  const fcLocales = locale === "pl" ? [plLocale] : [enLocale];
  const fcLocale = locale === "pl" ? "pl" : "en-gb";

  return (
    <Box
      className={styles.root}
      padding="1.5rem 1.5rem 0 1.5rem"
      overflowY="auto"
      p={4}
    >
      <FullCalendar
        ref={calendarRef}
        datesSet={(arg: DatesSetArg) => {
          const newStart = arg.start ? arg.start.getTime() : null;
          const newEnd = arg.end ? arg.end.getTime() : null;
          const curStart = visibleRange.start
            ? visibleRange.start.getTime()
            : null;
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
        }}
        key={initialView}
        plugins={[dayGridPlugin, timeGridPlugin]}
        locales={fcLocales}
        locale={fcLocale}
        firstDay={1}
        themeSystem="bootstrap"
        initialView={initialView}
        weekends={true}
        events={eventsWithColor}
        /* swap certain chakra color tokens to their darker variants on hover */
        eventMouseEnter={(info) => {
          try {
            const el = info?.el as HTMLElement | undefined;
            if (!el) return;
            // store original inline background so we can restore it
            if (el.dataset.fcOrigBg === undefined)
              el.dataset.fcOrigBg = el.style.backgroundColor || "";

            // mapping of token substrings -> hover replacement
            const mappings = [
              {
                match: "--chakra-colors-secondary-300",
                to: "var(--chakra-colors-secondary-500)",
              },
              {
                match: "secondary-300",
                to: "var(--chakra-colors-secondary-500)",
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

            // prefer inline style value if present, otherwise computed style
            const inlineBg = el.style.backgroundColor || "";
            const compBg = getComputedStyle(el).backgroundColor || "";
            const bgToCheck = inlineBg || compBg || "";

            for (const m of mappings) {
              if (bgToCheck.includes(m.match)) {
                el.style.transition = "background-color 140ms ease-in-out";
                el.style.backgroundColor = m.to;
                break;
              }
            }
          } catch {
            /* ignore */
          }
        }}
        eventMouseLeave={(info) => {
          try {
            const el = info?.el as HTMLElement | undefined;
            if (!el) return;
            // restore original inline background (empty string is valid)
            if (el.dataset.fcOrigBg !== undefined) {
              el.style.backgroundColor = el.dataset.fcOrigBg;
            }
            el.style.transition = "background-color 140ms ease-in-out";
          } catch {
            /* ignore */
          }
        }}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        scrollTime="06:00:00"
        allDaySlot={false}
        height="calc(100vh - 12rem)"
        eventContent={(arg: EventContentArg) => {
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
              style={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* show standard timeText only for events that do NOT span multiple days */}
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
              <div
                style={{ fontWeight: 700, fontSize: "0.95em", lineHeight: 1 }}
              >
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
        }}
        /* navigate to event id appended to current path */
        eventClick={(info) => {
          router.push(`${pathname}/${info.event.extendedProps.id}`);
        }}
      />
    </Box>
  );
}
