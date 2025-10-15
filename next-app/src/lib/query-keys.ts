import type { GroupIdType } from "@/schemas/model/group/group-types";

export const QUERY_KEYS = {
  groups: ["groups"],
  group: (id: GroupIdType) => ["groups", id],
} as const;
