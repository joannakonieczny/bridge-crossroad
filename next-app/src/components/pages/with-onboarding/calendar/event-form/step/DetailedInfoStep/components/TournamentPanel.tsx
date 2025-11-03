"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormControl, Select, FormErrorMessage } from "@chakra-ui/react";
import { TournamentType } from "@/club-preset/event-type";
import type { EventType } from "@/club-preset/event-type";
import ContestantsPairsEditor from "@/components/pages/with-onboarding/calendar/event-form/ContestantsPairsEditor";
import type { AddEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";

type Member = {
  id: string;
  nickname?: string;
  name: { firstName: string; lastName: string };
};

export default function TournamentPanel({ people }: { people: Member[] }) {
  const form = useFormContext<AddEventSchemaType>();

  return (
    <>
      <Controller
        control={form.control}
        name="data.tournamentType"
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            {error && (
              <FormErrorMessage mb={2}>
                Niepoprawny typ turnieju
              </FormErrorMessage>
            )}
            <Select
              placeholder="Typ turnieju"
              id="tournamentType"
              value={field.value as unknown as string}
              onChange={(e) => field.onChange(e.target.value as EventType)}
            >
              <option value={TournamentType.MAX}>MAX</option>
              <option value={TournamentType.IMPS}>IMPS</option>
              <option value={TournamentType.CRAZY}>CRAZY</option>
              <option value={TournamentType.TEAM}>TEAM</option>
              <option value={TournamentType.INDIVIDUAL}>INDIVIDUAL</option>
              <option value={TournamentType.BAMY}>BAMY</option>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        control={form.control}
        name="data.arbiter"
        render={({ field }) => (
          <FormControl>
            <Select
              placeholder="Arbiter"
              id="arbiter"
              value={field.value as unknown as string}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {people.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.nickname
                    ? member.nickname
                    : `${member.name.firstName} ${member.name.lastName}`}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <ContestantsPairsEditor
        control={form.control}
        name="data.contestantsPairs"
        label="Lista par"
        people={people}
      />
    </>
  );
}
