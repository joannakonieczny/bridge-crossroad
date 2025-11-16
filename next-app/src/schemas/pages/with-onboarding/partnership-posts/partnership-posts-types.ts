import type { z } from "zod";
import type * as s from "./partnership-posts-schema";

export type AddPartnershipPostSchemaType = z.infer<
  typeof s.addPartnershipPostSchema
>;
export type ModifyPartnershipPostSchemaType = z.infer<
  typeof s.modifyPartnershipPostSchema
>;
