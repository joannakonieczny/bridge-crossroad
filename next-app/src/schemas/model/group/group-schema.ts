import { z } from "zod";
import { GroupValidationConstants } from "./group-const";
import type { TKey } from "@/lib/typed-translations";
import { idPropSchema } from "@/schemas/common";

const { name, description, invitationCode, imageUrl } =
  GroupValidationConstants;

export const nameSchema = z
  .string()
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

export const imageUrlSchema = z
  .string()
  .max(imageUrl.max, "validation.model.group.imageUrl.max" satisfies TKey)
  .url("validation.model.group.imageUrl.url" satisfies TKey);

// additional
export const havingGroupId = z.object({
  groupId: idPropSchema,
});
