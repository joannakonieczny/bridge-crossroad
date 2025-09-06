import type { z } from "zod";
import type {
  descriptionSchema,
  imageUrlSchema,
  invitationCodeSchema,
  nameSchema,
} from "./group-schema";

export type NameType = z.infer<typeof nameSchema>;
export type InvitationCodeType = z.infer<typeof invitationCodeSchema>;
export type DescriptionType = z.infer<typeof descriptionSchema>;
export type ImageUrlType = z.infer<typeof imageUrlSchema>;

export type GroupIdType = string;
