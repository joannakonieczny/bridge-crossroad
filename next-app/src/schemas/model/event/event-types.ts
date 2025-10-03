import type { z } from "zod";
import type {
  titleSchema,
  descriptionSchema,
  locationSchema,
  imageUrlSchema,
  durationSchema,
  dataSchema,
  eventSchema,
} from "./event-schema";

export type TitleType = z.infer<typeof titleSchema>;
export type DescriptionType = z.infer<typeof descriptionSchema>;
export type LocationType = z.infer<typeof locationSchema>;
export type ImageUrlType = z.infer<typeof imageUrlSchema>;
export type DurationType = z.infer<typeof durationSchema>;
export type EventDataType = z.infer<typeof dataSchema>;
export type IEventSchema = z.infer<typeof eventSchema>;

export type EventIdType = string;
