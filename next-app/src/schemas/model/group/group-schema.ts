import { z } from "zod";
import { GroupValidationConstants } from "./group-const";

const { name, description, invitationCode, imageUrl } =
  GroupValidationConstants;

export const nameSchema = z
  .string()
  .nonempty("validation.model.group.name.required")
  .min(name.min, "validation.model.group.name.min")
  .max(name.max, "validation.model.group.name.max")
  .regex(name.regex, "validation.model.group.name.regex");

export const descriptionSchema = z
  .string()
  .max(description.max, "validation.model.group.description.max");

export const invitationCodeSchema = z
  .string()
  .length(invitationCode.length, "validation.model.group.invitationCode.length")
  .regex(invitationCode.regex, "validation.model.group.invitationCode.regex");

export const imageUrlSchema = z
  .string()
  .max(imageUrl.max, "validation.model.group.imageUrl.max")
  .url("validation.model.group.imageUrl.url");
