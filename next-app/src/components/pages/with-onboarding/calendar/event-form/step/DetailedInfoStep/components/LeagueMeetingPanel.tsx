"use client";

import { useFormContext } from "react-hook-form";
import SessionEditor from "@/components/pages/with-onboarding/calendar/event-form/SessionEditor";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

type Member = {
  id: string;
  nickname?: string;
  name: { firstName: string; lastName: string };
};

export default function LeagueMeetingPanel({ people }: { people: Member[] }) {
  const form = useFormContext<AddEventSchemaType>();

  return (
    <>
      <SessionEditor
        control={form.control}
        name="data.session"
        people={people}
      />
    </>
  );
}
