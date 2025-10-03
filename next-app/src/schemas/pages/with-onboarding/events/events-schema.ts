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

export const addModifyEventSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  location: locationSchema.optional(),
  organizer: idPropSchema,
  duration: durationSchema,
  additionalDescription: z.string().optional(),
  data: dataSchema,
  imageUrl: imageUrlSchema.optional(),
});
