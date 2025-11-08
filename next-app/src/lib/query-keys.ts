import type { EventIdType } from "@/schemas/model/event/event-types";
import type { GroupIdType } from "@/schemas/model/group/group-types";

export const QUERY_KEYS = {
  groups: ["groups"],
  group: (id: GroupIdType) => ["groups", id],
  event: (id: EventIdType) => ["events", id],
} as const;
