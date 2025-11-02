import type { z } from "zod";
import type * as s from "./events-schema";

export type ModifyEventSchemaType = z.infer<typeof s.modifyEventSchema>;
export type AddEventSchemaType = z.infer<typeof s.addEventSchema>;
