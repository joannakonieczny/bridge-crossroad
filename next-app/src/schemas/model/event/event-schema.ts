import { z } from "zod";
import { EventValidationConstants } from "./event-const";
import type { TKey } from "@/lib/typed-translations";
import { idPropSchema } from "@/schemas/common";
import { EventType, Half, TournamentType } from "@/club-preset/event-type";

const { title, description, location, imageUrl } = EventValidationConstants;

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
  });

// Data discriminators
export const tournamentDataSchema = z.object({
  type: z.literal(EventType.TOURNAMENT),
  contestantsPairs: z
    .array(
      z.object({
        first: idPropSchema,
        second: idPropSchema,
      })
    )
    .nonempty(),
  arbiter: idPropSchema,
  tournamentType: z.nativeEnum(TournamentType).optional(),
  teams: z
    .array(z.object({ name: z.string(), members: z.array(idPropSchema) }))
    .optional(),
});

export const leagueMeetingDataSchema = z.object({
  type: z.literal(EventType.LEAGUE_MEETING),
  tournamentType: z.nativeEnum(TournamentType).optional(),
  session: z
    .array(
      z.object({
        _id: idPropSchema.optional(),
        matchNumber: z.number().int(),
        half: z.nativeEnum(Half),
        contestants: z.object({
          firstPair: z.object({ first: idPropSchema, second: idPropSchema }),
          secondPair: z.object({ first: idPropSchema, second: idPropSchema }),
        }),
        opponentTeamName: z.string().optional(),
      })
    )
    .nonempty(),
});

export const trainingDataSchema = z.object({
  type: z.literal(EventType.TRAINING),
  coach: idPropSchema.optional(),
  topic: z.string().nonempty(),
});

export const otherDataSchema = z.object({ type: z.literal(EventType.OTHER) });

export const dataSchema = z.discriminatedUnion("type", [
  tournamentDataSchema,
  leagueMeetingDataSchema,
  trainingDataSchema,
  otherDataSchema,
]);

export const eventSchema = z.object({
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
