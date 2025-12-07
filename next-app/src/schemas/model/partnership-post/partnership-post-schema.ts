import z from "zod";
import {
  durationSchema,
  idPropSchema,
  withTimeStampsSchema,
} from "@/schemas/common";
import type { TKey } from "@/lib/typed-translations";
import {
  BiddingSystem,
  PartnershipPostStatus,
  PartnershipPostType,
} from "@/club-preset/partnership-post";
import { PartnershipPostValidationConstants as c } from "./partnership-post-const";

// fields
export const nameSchema = z
  .string({
    message: "validation.model.partnershipPost.name.required" satisfies TKey,
  })
  .min(c.name.min, "validation.model.partnershipPost.name.min" satisfies TKey)
  .max(c.name.max, "validation.model.partnershipPost.name.max" satisfies TKey);

export const descriptionSchema = z
  .string()
  .max(
    c.description.max,
    "validation.model.partnershipPost.description.max" satisfies TKey
  )
  .optional();

// data discriminators
export const singleDataSchema = z.object({
  type: z.literal(PartnershipPostType.SINGLE),
  eventId: idPropSchema,
});

export const periodDataSchema = z.object({
  type: z.literal(PartnershipPostType.PERIOD),
  duration: durationSchema,
});

export const partnershipPostDataSchema = z.discriminatedUnion("type", [
  singleDataSchema,
  periodDataSchema,
]);

// main schema
export const partnershipPostSchema = z
  .object({
    id: idPropSchema,
    ownerId: idPropSchema,
    groupId: idPropSchema,
    name: nameSchema,
    description: descriptionSchema,
    biddingSystem: z.nativeEnum(BiddingSystem),
    status: z.nativeEnum(PartnershipPostStatus),
    interestedUsersIds: z.array(idPropSchema).optional(),
    data: partnershipPostDataSchema,
  })
  .merge(withTimeStampsSchema);

export const havingPartnershipPostId = z.object({
  partnershipPostId: idPropSchema,
});
