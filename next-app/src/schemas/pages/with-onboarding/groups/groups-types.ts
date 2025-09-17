import type { z } from "zod";
import type { createGroupFormSchema } from "./groups-schema";

export type CreateGroupFormType = z.infer<typeof createGroupFormSchema>;
