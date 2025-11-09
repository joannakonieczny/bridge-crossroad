import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useActionQuery } from "./tanstack-action/actions-querry";
import { getJoinedGroupsInfo, getGroupData } from "@/services/groups/api";
import type { TActionQueryOptionsHelper } from "./tanstack-action/types";

export const QUERY_KEYS = {
  joinedGroups: ["groups"],
  groupDetail: (id: GroupIdType) => ["groups", id],
} as const;

export function useJoinedGroupsQuery(
  props?: TActionQueryOptionsHelper<typeof getJoinedGroupsInfo>
) {
  return useActionQuery({
    queryKey: QUERY_KEYS.joinedGroups,
    action: getJoinedGroupsInfo,
    ...props,
  });
}

export function useGroupQuery(
  groupId: GroupIdType,
  props?: TActionQueryOptionsHelper<typeof getGroupData>
) {
  return useActionQuery({
    queryKey: QUERY_KEYS.groupDetail(groupId),
    action: () => getGroupData({ groupId }),
    ...props,
  });
}
