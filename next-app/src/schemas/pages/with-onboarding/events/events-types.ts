import type { z } from "zod";
import type { addModifyEventSchema } from "./events-schema";

export type AddModifyEventSchemaType = z.infer<typeof addModifyEventSchema>;
