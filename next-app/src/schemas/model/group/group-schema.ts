import { z } from "zod";
import { GroupValidationConstants } from "./group-const";
import type { TKey } from "@/lib/typed-translations";
import {
  filePathSchema,
  idPropSchema,
  withTimeStampsSchema,
} from "@/schemas/common";
import { userSchemaBasicWithOnboarding } from "../user/user-schema";

const { name, description, invitationCode } = GroupValidationConstants;

export const nameSchema = z
  .string({
    message: "validation.model.group.name.required" satisfies TKey,
  })
  .nonempty("validation.model.group.name.required" satisfies TKey)
  .min(name.min, "validation.model.group.name.min" satisfies TKey)
  .max(name.max, "validation.model.group.name.max" satisfies TKey)
  .regex(name.regex, "validation.model.group.name.regex" satisfies TKey);

export const descriptionSchema = z
  .string()
  .max(
    description.max,
    "validation.model.group.description.max" satisfies TKey
  );

export const invitationCodeSchema = z
  .string()
  .length(
    invitationCode.length,
    "validation.model.group.invitationCode.length" satisfies TKey
  )
  .regex(
    invitationCode.regex,
    "validation.model.group.invitationCode.regex" satisfies TKey
  );

// additional
export const havingGroupId = z.object({
  groupId: idPropSchema,
});

export const havingInvitationCode = z.object({
  invitationCode: invitationCodeSchema,
});

export const groupBasicSchema = z.object({
  id: idPropSchema,
  name: nameSchema,
  description: descriptionSchema.optional(),
  imageUrl: filePathSchema.optional(),
  isMain: z.boolean(),
});

export const groupFullSchema = groupBasicSchema
  .extend({
    invitationCode: invitationCodeSchema,
    members: z.array(userSchemaBasicWithOnboarding),
    admins: z.array(userSchemaBasicWithOnboarding),
  })
  .merge(withTimeStampsSchema);
