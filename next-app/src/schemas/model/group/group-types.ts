import type { z } from "zod";
import type * as s from "./group-schema";

export type NameType = z.infer<typeof s.nameSchema>;
export type InvitationCodeType = z.infer<typeof s.invitationCodeSchema>;
export type DescriptionType = z.infer<typeof s.descriptionSchema>;
export type ImageUrlType = z.infer<typeof s.imageUrlSchema>;

export type GroupIdType = string;

export type GroupBasicType = z.infer<typeof s.groupBasicSchema>;
export type GroupFullType = z.infer<typeof s.groupFullSchema>;
