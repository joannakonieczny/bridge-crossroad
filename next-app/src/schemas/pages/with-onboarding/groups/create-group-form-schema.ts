import { z } from "zod";
import {
  nameSchema,
  descriptionSchema,
  imageUrlSchema,
  invitationCodeSchema,
} from "@/schemas/model/group/group-schema";

export const createGroupFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(), 
  imageUrl: imageUrlSchema.optional(),      
  invitationCode: invitationCodeSchema,
});

export type CreateGroupFormInput = z.infer<typeof createGroupFormSchema>;
