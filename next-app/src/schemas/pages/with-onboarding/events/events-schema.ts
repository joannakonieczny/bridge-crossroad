import { z } from "zod";
import {
  idPropSchemaM,
  durationSchema,
  idPropSchema,
  filePathSchema,
} from "@/schemas/common";
import {
  additionalDescriptionSchema,
  descriptionSchema,
  havingEventId,
  leagueMeetingDataSchema,
  locationSchema,
  otherDataSchema,
  playingPairSchema,
  playingTeamSchema,
  titleSchema,
  trainingDataSchema,
} from "@/schemas/model/event/event-schema";
import { EventType, TournamentType } from "@/club-preset/event-type";
import type { TKey } from "@/lib/typed-translations";
import { desanitizeFileUrl } from "@/util/helpers";

export const addEventSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  location: locationSchema.optional(),
  group: idPropSchemaM("validation.model.event.group.required" satisfies TKey),
  organizer: idPropSchemaM(
    "validation.model.event.organizer.required" satisfies TKey
  ),
  duration: durationSchema,
  additionalDescription: additionalDescriptionSchema.optional(),
  imageUrl: filePathSchema.optional(),
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
  organizer: idPropSchemaM(
    "validation.model.event.organizer.required" satisfies TKey
  ),
  duration: durationSchema,
  additionalDescription: additionalDescriptionSchema.optional(),
  imageUrl: filePathSchema.optional().transform(desanitizeFileUrl),
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

export const enrollToEventTournamentSchema = havingEventId.merge(
  z.object({
    pair: playingPairSchema.optional(),
    team: playingTeamSchema.optional(),
  })
);
