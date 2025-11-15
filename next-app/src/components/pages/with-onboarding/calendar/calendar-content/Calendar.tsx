"use client";

import styles from "./calendar-overrides.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import plLocale from "@fullcalendar/core/locales/pl";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { useLocale } from "next-intl";
import "./calendar-overrides.module.css";

function getEventDayColor(start: string | Date) {
  const date = typeof start === "string" ? new Date(start) : start;
  if (Number.isNaN(date.getTime())) return "var(--chakra-colors-accent-300)";
  const eventDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (eventDate.getTime() > todayDate.getTime()) {
    //future
    return "var(--chakra-colors-accent-300)";
  } else if (eventDate.getTime() === todayDate.getTime()) {
    //today
    return "var(--chakra-colors-secondary-300)";
  } else {
    //past
    return "var(--chakra-colors-border-300)";
  }
}

export default function Calendar() {
  const locale = useLocale();

  const showSingleDay = useBreakpointValue({ base: true, md: false }) ?? false;
  const initialView = showSingleDay ? "timeGridDay" : "timeGridWeek";

  const rawEvents = [
    {
      title: "Meeting",
      start: "2025-10-18T09:00:00",
      end: "2025-10-18T10:00:00",
      extendedProps: {
        description: "Turniej MAXy",
        image: "https://picsum.photos/80/80?grayscale",
      },
    },
    {
      title: "Meeting",
      start: "2025-10-19T09:00:00",
      end: "2025-10-19T10:00:00",
      extendedProps: {
        description: "Turniej MAXy",
        image: "https://picsum.photos/80/80?grayscale",
      },
    },
    {
      title: "Gr. podstawowa",
      start: "2025-10-20T18:00:00",
      end: "2025-10-20T20:00:00",
      extendedProps: { description: "Turniej MAXy" },
    },
    {
      title: "Gr. zaawansowana",
      start: "2025-10-21T17:00:00",
      end: "2025-10-21T18:00:00",
      extendedProps: { description: "Trening grupa zaawansowana" },
    },
    {
      title: "Żaczek",
      start: "2025-10-22T19:00:00",
      end: "2025-10-22T22:00:00",
      extendedProps: { description: "Żaczek" },
    },
    {
      title: "Integracja",
      start: "2025-10-23T12:00:00",
      end: "2025-10-23T13:00:00",
      extendedProps: { description: "Integracja" },
    },
    {
      title: "Akademickie mistrzostwa Polski",
      start: "2025-10-24T13:00:00",
      end: "2025-10-24T16:00:00",
      extendedProps: { description: "Akademickie mistrzostwa Polski" },
    },
    {
      title: "Otwarty turniej teamów",
      start: "2025-10-25T17:00:00",
      end: "2025-10-25T19:00:00",
      extendedProps: { description: "Otwarty turniej teamów" },
    },
    {
      title: "Urodziny Just Bridge",
      start: "2025-10-25T12:00:00",
      end: "2025-10-25T13:00:00",
      extendedProps: { description: "Urodziny Just Bridge" },
    },
  ];

  const eventsWithColor = rawEvents.map((e) => ({
    ...e,
    color: getEventDayColor(e.start),
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
