import type { GroupIdType } from "@/schemas/model/group/group-types";

export const QUERY_KEYS = {
  groups: ["groups"], //groups that I belong to (getJoinedGroupsInfo)
  group: (id: GroupIdType) => ["groups", id], //specific group that I belong to by id (getGroupData)
} as const;
