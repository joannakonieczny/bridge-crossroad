import { z } from "zod";
import {
  nameSchema,
  descriptionSchema,
  invitationCodeSchema,
} from "@/schemas/model/group/group-schema";
import { filePathSchema } from "@/schemas/common";

export const createGroupFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(),
  imageUrl: filePathSchema.optional(),
  invitationCode: invitationCodeSchema.optional(),
});
