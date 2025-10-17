import { z } from "zod";
import {
  nameSchema,
  descriptionSchema,
  imageUrlSchema,
  invitationCodeSchema,
} from "@/schemas/model/group/group-schema";
import { transformEmptyStringsToUndefined } from "@/schemas/common";

export const createGroupFormSchema = z.object({
  name: nameSchema,
  description: transformEmptyStringsToUndefined(descriptionSchema.optional()),
  imageUrl: transformEmptyStringsToUndefined(imageUrlSchema.optional()),
  invitationCode: transformEmptyStringsToUndefined(
    invitationCodeSchema.optional()
  ),
});
