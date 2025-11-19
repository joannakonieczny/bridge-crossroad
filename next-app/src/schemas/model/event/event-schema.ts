import { z } from "zod";
import { EventValidationConstants } from "./event-const";
import type { TKey } from "@/lib/typed-translations";
import { idPropSchema } from "@/schemas/common";
import { EventType, TournamentType } from "@/club-preset/event-type";

const { title, description, location, imageUrl, team } =
  EventValidationConstants;

export const titleSchema = z
  .string()
  .nonempty("validation.model.event.title.required" satisfies TKey)
  .min(title.min, "validation.model.event.title.min" satisfies TKey)
  .max(title.max, "validation.model.event.title.max" satisfies TKey)
  .regex(title.regex, "validation.model.event.title.regex" satisfies TKey);

export const descriptionSchema = z
  .string()
  .max(
    description.max,
    "validation.model.event.description.max" satisfies TKey
  );

export const locationSchema = z
  .string()
  .max(location.max, "validation.model.event.location.max" satisfies TKey);

export const imageUrlSchema = z
  .string()
  .max(imageUrl.max, "validation.model.event.imageUrl.max" satisfies TKey)
  .url("validation.model.event.imageUrl.url" satisfies TKey);

export const durationSchema = z
  .object({
    startsAt: z.date(),
    endsAt: z.date(),
  })
  .refine((d) => d.startsAt < d.endsAt, {
    message: "validation.model.event.duration.invalidRange" satisfies TKey,
    path: ["endsAt"],
  });

export const playingPairSchema = z
  .object({
    first: idPropSchema,
    second: idPropSchema,
  })
  .refine((s) => s.first !== s.second, {
    message:
      "validation.model.event.playingPair.firstSecondDistinct" satisfies TKey,
  });

export const playingTeamSchema = z.object({
  name: z
    .string()
    .min(team.name.min, "validation.model.event.team.name.min" satisfies TKey)
    .max(team.name.max, "validation.model.event.team.name.max" satisfies TKey),
  members: z
    .array(idPropSchema)
    .min(
      team.members.min,
      "validation.model.event.team.members.min" satisfies TKey
    )
    .refine((members) => new Set(members).size === members.length, {
      message: "validation.model.event.team.members.unique" satisfies TKey,
      path: ["members"],
    }),
});

// Data discriminators
export const tournamentPairsDataSchema = z.object({
  type: z.literal(EventType.TOURNAMENT_PAIRS),
  contestantsPairs: z.array(playingPairSchema),
  arbiter: idPropSchema.optional(),
  tournamentType: z.nativeEnum(TournamentType).optional(),
});

export const tournamentTeamsDataSchema = z.object({
  type: z.literal(EventType.TOURNAMENT_TEAMS),
  teams: z.array(playingTeamSchema),
  arbiter: idPropSchema.optional(),
  tournamentType: z.nativeEnum(TournamentType).optional(),
});

const sessionItemSchema = z
  .object({
    contestants: z.object({
      firstPair: playingPairSchema,
      secondPair: playingPairSchema,
    }),
    opponentTeamName: z.string().optional(),
  })
  .refine(
    (data) => {
      const people = [
        data.contestants.firstPair.first,
        data.contestants.firstPair.second,
        data.contestants.secondPair.first,
        data.contestants.secondPair.second,
      ].filter((id) => id && id.trim() !== "");

      // Check if all selected people are unique
      const uniquePeople = new Set(people);
      return people.length === uniquePeople.size;
    },
    {
      message: "validation.model.event.session.duplicatePlayers" satisfies TKey,
      path: ["contestants"],
    }
  );

export const leagueMeetingDataSchema = z.object({
  type: z.literal(EventType.LEAGUE_MEETING),
  tournamentType: z.nativeEnum(TournamentType).optional(),
  session: z.array(sessionItemSchema),
});

export const trainingDataSchema = z.object({
  type: z.literal(EventType.TRAINING),
  coach: idPropSchema.optional(),
  topic: z.string().nonempty(),
});

export const otherDataSchema = z.object({ type: z.literal(EventType.OTHER) });

export const dataSchema = z.discriminatedUnion("type", [
  tournamentPairsDataSchema,
  tournamentTeamsDataSchema,
  leagueMeetingDataSchema,
  trainingDataSchema,
  otherDataSchema,
]);

export const eventSchema = z.object({
  id: idPropSchema,
  title: titleSchema,
  description: descriptionSchema.optional(),
  location: locationSchema.optional(),
  organizer: idPropSchema,
  attendees: z.array(idPropSchema),
  group: idPropSchema,
  duration: durationSchema,
  additionalDescription: z.string().optional(),
  data: dataSchema,
  imageUrl: imageUrlSchema.optional(),
});

export const havingEventId = z.object({ eventId: idPropSchema });
