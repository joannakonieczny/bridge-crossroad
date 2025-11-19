import { z } from "zod";
import {
  nameSchema,
  descriptionSchema,
  imageUrlSchema,
  invitationCodeSchema,
} from "@/schemas/model/group/group-schema";
import { allEmptyStringsToUndefined } from "@/schemas/common";

export const createGroupFormSchema = allEmptyStringsToUndefined(
  z.object({
    name: nameSchema,
    description: descriptionSchema.optional(),
    imageUrl: imageUrlSchema.optional(),
    invitationCode: invitationCodeSchema.optional(),
  })
);
