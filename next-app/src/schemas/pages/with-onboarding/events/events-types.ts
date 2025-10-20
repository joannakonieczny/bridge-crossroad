import type { z } from "zod";
import type * as s from "./events-schema";

export type AddModifyEventSchemaType = z.infer<typeof s.addModifyEventSchema>;
