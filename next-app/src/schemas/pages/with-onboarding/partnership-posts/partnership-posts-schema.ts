import { z } from "zod";
import { idPropSchema } from "@/schemas/common";

import {
  BiddingSystem,
  PartnershipPostStatus,
} from "@/club-preset/partnership-post";
import {
  descriptionSchema,
  nameSchema,
  partnershipPostDataSchema,
} from "@/schemas/model/partnership-post/partnership-post-schema";

export const addPartnershipPostSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(),
  group: idPropSchema,
  biddingSystem: z.nativeEnum(BiddingSystem),
  data: partnershipPostDataSchema,
});

export const modifyPartnershipPostSchema = z.object({
  name: nameSchema.optional(),
  description: descriptionSchema.optional(),
  biddingSystem: z.nativeEnum(BiddingSystem).optional(),
  data: partnershipPostDataSchema.optional(),
});

export const listPartnershipPostsSchema = z.object({
  status: z
    .nativeEnum(PartnershipPostStatus)
    .default(PartnershipPostStatus.ACTIVE),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});
