import { z } from "zod";
import { idPropSchema } from "@/schemas/common";
import {
  dataSchema,
  descriptionSchema,
  durationSchema,
  imageUrlSchema,
  locationSchema,
  titleSchema,
} from "@/schemas/model/event/event-schema";

export const addEventSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  location: locationSchema.optional(),
  group: idPropSchema,
  organizer: idPropSchema,
  duration: durationSchema,
  additionalDescription: z.string().optional(),
  data: dataSchema,
  imageUrl: imageUrlSchema.optional(),
});

export const modifyEventSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  location: locationSchema.optional(),
  organizer: idPropSchema,
  duration: durationSchema,
  additionalDescription: z.string().optional(),
  data: dataSchema,
  imageUrl: imageUrlSchema.optional(),
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
