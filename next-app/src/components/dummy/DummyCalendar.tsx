"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Box } from "@chakra-ui/react";

export default function DummyCalendar() {
  return (
    <Box padding="3rem">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        weekends={true}
        events={[
          { title: "Meeting", start: "2025-08-30T10:00:00", end: "2025-08-30T11:30:00" },
          { title: "Lunch", start: "2025-08-31T12:00:00", end: "2025-08-31T13:00:00" },
        ]}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        height="auto"
      />
    </Box>
  );
}