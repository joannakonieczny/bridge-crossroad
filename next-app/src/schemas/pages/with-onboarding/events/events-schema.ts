import { z } from "zod";
import { allEmptyStringsToUndefined, idPropSchema } from "@/schemas/common";
import {
  additionalDescriptionSchema,
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

export const addEventSchema = allEmptyStringsToUndefined(
  z.object({
    title: titleSchema,
    description: descriptionSchema.optional(),
    location: locationSchema.optional(),
    group: idPropSchema,
    organizer: idPropSchema,
    duration: durationSchema,
    additionalDescription: additionalDescriptionSchema.optional(),
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
  })
);

export const modifyEventSchema = allEmptyStringsToUndefined(
  z
    .object({
      title: titleSchema,
      description: descriptionSchema.optional(),
      location: locationSchema.optional(),
      organizer: idPropSchema,
      duration: durationSchema,
      additionalDescription: additionalDescriptionSchema.optional(),
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
    })
    .partial()
);

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
