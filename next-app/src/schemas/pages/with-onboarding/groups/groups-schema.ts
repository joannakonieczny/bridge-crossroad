import { z } from "zod";
import {
  nameSchema,
  descriptionSchema,
  invitationCodeSchema,
} from "@/schemas/model/group/group-schema";
import { filePathSchema } from "@/schemas/common";
import { desanitizeFileUrl } from "@/util/helpers";

export const createModifyGroupFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(),
  imageUrl: filePathSchema
    .optional()
    .transform((value) => desanitizeFileUrl(value)),
  invitationCode: invitationCodeSchema.optional(),
});
