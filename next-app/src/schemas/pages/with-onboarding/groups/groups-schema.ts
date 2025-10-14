import { z } from "zod";
import {
  nameSchema,
  descriptionSchema,
  imageUrlSchema,
  invitationCodeSchema,
} from "@/schemas/model/group/group-schema";
import { idPropSchema } from "@/schemas/common";

export const createGroupFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(),
  imageUrl: imageUrlSchema.optional(),
  invitationCode: invitationCodeSchema.optional(),
});

export const GroupDataSchema = z.object({
  id: idPropSchema,
  name: nameSchema,
  description: descriptionSchema.optional(),
  imageUrl: imageUrlSchema.optional(),
  isMain: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});