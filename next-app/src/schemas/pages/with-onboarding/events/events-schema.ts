import { z } from "zod";
import { idPropSchema } from "@/schemas/common";
import {
  descriptionSchema,
  durationSchema,
  imageUrlSchema,
  leagueMeetingDataSchema,
  locationSchema,
  otherDataSchema,
  titleSchema,
  trainingDataSchema,
} from "@/schemas/model/event/event-schema";
import { EventType, TournamentType } from "@/club-preset/event-type";

export const addEventSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  location: locationSchema.optional(),
  group: idPropSchema,
  organizer: idPropSchema,
  duration: durationSchema,
  additionalDescription: z.string().optional(),
  imageUrl: imageUrlSchema.optional(),
  data: z.discriminatedUnion("type", [
    z.object({
      type: z.literal(EventType.TOURNAMENT_PAIRS),
      arbiter: idPropSchema.optional(),
      tournamentType: z.nativeEnum(TournamentType).optional(),
    }),
    z.object({
      type: z.literal(EventType.TOURNAMENT_TEAMS),
      arbiter: idPropSchema.optional(),
      tournamentType: z.nativeEnum(TournamentType).optional(),
    }),
    leagueMeetingDataSchema,
    trainingDataSchema,
    otherDataSchema,
  ]),
});

export const modifyEventSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  location: locationSchema.optional(),
  organizer: idPropSchema,
  duration: durationSchema,
  additionalDescription: z.string().optional(),
  imageUrl: imageUrlSchema.optional(),
  data: z.discriminatedUnion("type", [
    z.object({
      type: z.literal(EventType.TOURNAMENT_PAIRS),
      arbiter: idPropSchema.optional(),
      tournamentType: z.nativeEnum(TournamentType).optional(),
    }),
    z.object({
      type: z.literal(EventType.TOURNAMENT_TEAMS),
      arbiter: idPropSchema.optional(),
      tournamentType: z.nativeEnum(TournamentType).optional(),
    }),
    leagueMeetingDataSchema,
    trainingDataSchema,
    otherDataSchema,
  ]),
});

export const timeWindowSchema = z
  .object({
    start: z.preprocess(
      (v) => (v ? new Date(v as string) : undefined),
      z.date().optional()
    ),
    end: z.preprocess(
      (v) => (v ? new Date(v as string) : undefined),
      z.date().optional()
    ),
  })
  .optional();
