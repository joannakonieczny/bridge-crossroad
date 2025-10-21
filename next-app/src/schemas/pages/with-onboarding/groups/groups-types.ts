import type { z } from "zod";
import type * as s from "./groups-schema";

export type CreateGroupFormType = z.infer<typeof s.createGroupFormSchema>;
