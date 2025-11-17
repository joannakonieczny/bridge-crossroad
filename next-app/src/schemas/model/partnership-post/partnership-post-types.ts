import type { z } from "zod";
import type * as s from "./partnership-post-schema";
import type { UserTypeBasic } from "../user/user-types";
import type { GroupBasicType } from "../group/group-types";

export type NameType = z.infer<typeof s.nameSchema>;
export type DescriptionType = z.infer<typeof s.descriptionSchema>;

export type SingleDataType = z.infer<typeof s.singleDataSchema>;
export type PeriodDataType = z.infer<typeof s.periodDataSchema>;
export type PartnershipPostDataType = z.infer<
  typeof s.partnershipPostDataSchema
>;

export type PartnershipPostSchemaType = z.infer<typeof s.partnershipPostSchema>;

export type HavingPartnershipPostIdType = z.infer<
  typeof s.havingPartnershipPostId
>;

export type PartnershipPostIdType = string;

export type PartnershipPostSchemaTypePopulated = Omit<
  PartnershipPostSchemaType,
  "ownerId" | "groupId" | "interestedUsersIds"
> & {
  owner: UserTypeBasic;
  group: GroupBasicType;
  interestedUsers?: UserTypeBasic[];
  isOwnByUser?: boolean;
};
