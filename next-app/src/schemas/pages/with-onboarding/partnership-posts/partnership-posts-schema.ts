import { z } from "zod";
import { idPropSchema } from "@/schemas/common";

import {
  BiddingSystem,
  PartnershipPostStatus,
  PartnershipPostType,
} from "@/club-preset/partnership-post";
import {
  descriptionSchema,
  nameSchema,
  partnershipPostDataSchema,
} from "@/schemas/model/partnership-post/partnership-post-schema";
import { TrainingGroup } from "@/club-preset/training-group";
import { Academy } from "@/club-preset/academy";

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
  limit: z.number().int().positive().max(100).default(10),
  type: z.nativeEnum(PartnershipPostType).optional(),
  onboardingData: z
    .object({
      academy: z.nativeEnum(Academy).optional(),
      yearOfBirth: z
        .object({
          min: z.number().int().optional(),
          max: z.number().int().optional(),
        })
        .optional(),
      startPlayingDate: z
        .object({
          min: z.date().optional(),
          max: z.date().optional(),
        })
        .optional(),
      trainingGroup: z.nativeEnum(TrainingGroup).optional(),
      hasRefereeLicense: z.boolean().optional(),
    })
    .optional(),
});

export const modifyPartnershipPostsStatusSchema = z.object({
  newStatus: z.nativeEnum(PartnershipPostStatus),
});
