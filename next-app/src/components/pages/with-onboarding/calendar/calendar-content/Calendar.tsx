"use client";

import styles from "./calendar-overrides.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import plLocale from "@fullcalendar/core/locales/pl";
import enLocale from "@fullcalendar/core/locales/en-gb";
import React from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { useLocale } from "next-intl";
import { useEventsForUserQuery } from "@/lib/queries";
import "./calendar-overrides.module.css";

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
  const locale = useLocale();
  const calendarRef = React.useRef<any>(null);
  const [visibleRange, setVisibleRange] = React.useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const showSingleDay = useBreakpointValue({ base: true, md: false }) ?? false;
  const initialView = showSingleDay ? "timeGridDay" : "timeGridWeek";

  let maxDate = new Date(8640000000000000);
  let minDate = new Date(-8640000000000000);

  const eventsQ = useEventsForUserQuery({
    start: minDate,
    end: maxDate,
  });

  const events = eventsQ.data?.events ?? [];

  const rawEvents = events.map((e) => ({
    title: e.title,
    start: e.duration.startsAt,
    end: e.duration.endsAt,
    extendedProps: {
      description: e.description,
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
        datesSet={(arg: any) => {
          // arg.start / arg.end are the visible range as Date objects
          const newStart = arg.start ? arg.start.getTime() : null;
          const newEnd = arg.end ? arg.end.getTime() : null;
          const curStart = visibleRange.start
            ? visibleRange.start.getTime()
            : null;
          const curEnd = visibleRange.end ? visibleRange.end.getTime() : null;
          // update state only when the timestamps actually change to avoid render loops
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
        key={initialView} // force reinit when breakpoint/view changes
        plugins={[dayGridPlugin, timeGridPlugin]}
        locales={fcLocales}
        locale={fcLocale}
        firstDay={1}
        themeSystem="bootstrap"
        initialView={initialView}
        weekends={true}
        events={eventsWithColor}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        scrollTime="06:00:00"
        allDaySlot={false}
        height="calc(100vh - 12rem)" //value adjusted for better fit
      />
    </Box>
  );
}
