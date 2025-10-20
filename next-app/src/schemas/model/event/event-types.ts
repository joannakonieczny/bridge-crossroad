import type { z } from "zod";
import type {
  titleSchema,
  descriptionSchema,
  locationSchema,
  imageUrlSchema,
  durationSchema,
  dataSchema,
  eventSchema,
  playingPairSchema,
  tournamentDataSchema,
  leagueMeetingDataSchema,
  trainingDataSchema,
  otherDataSchema,
} from "./event-schema";

export type TitleType = z.infer<typeof titleSchema>;
export type DescriptionType = z.infer<typeof descriptionSchema>;
export type LocationType = z.infer<typeof locationSchema>;
export type ImageUrlType = z.infer<typeof imageUrlSchema>;
export type DurationType = z.infer<typeof durationSchema>;

export type PlayingPairType = z.infer<typeof playingPairSchema>;
export type TournamentDataType = z.infer<typeof tournamentDataSchema>;
export type LeagueMeetingDataType = z.infer<typeof leagueMeetingDataSchema>;
export type TrainingDataType = z.infer<typeof trainingDataSchema>;
export type OtherDataType = z.infer<typeof otherDataSchema>;

export type EventDataType = z.infer<typeof dataSchema>;
export type EventSchemaType = z.infer<typeof eventSchema>;

export type EventIdType = string;
