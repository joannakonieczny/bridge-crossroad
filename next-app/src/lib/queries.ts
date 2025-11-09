import dayjs from "dayjs";
import { useActionQuery } from "./tanstack-action/actions-querry";
import { getJoinedGroupsInfo, getGroupData } from "@/services/groups/api";
import { listEventsForUser, getEvent } from "@/services/events/api";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { EventIdType } from "@/schemas/model/event/event-types";
import type { TActionQueryOptionsHelper } from "./tanstack-action/types";

export const QUERY_KEYS = {
  joinedGroups: ["groups"],
  groupDetail: (id: GroupIdType) => ["groups", id],
  calendarEvents: (start: Date, end: Date) => [
    "events",
    `${dayjs(start).format("DD/MM/YYYY")}|${dayjs(end).format("DD/MM/YYYY")}`,
  ],
  eventDetail: (id: EventIdType) => ["event", id],
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
    enabled: !!groupId || props?.enabled,
    ...props,
  });
}

export function useEventsForUserQuery(
  timeWindow: {
    start: Date;
    end: Date;
  },
  props?: TActionQueryOptionsHelper<typeof listEventsForUser>
) {
  return useActionQuery({
    queryKey: QUERY_KEYS.calendarEvents(timeWindow.start, timeWindow.end),
    action: () => listEventsForUser({ timeWindow }),
    ...props,
  });
}

export function useEventQuery(
  eventId: EventIdType,
  props?: TActionQueryOptionsHelper<typeof getEvent>
) {
  return useActionQuery({
    queryKey: QUERY_KEYS.eventDetail(eventId),
    action: () => getEvent({ eventId }),
    ...props,
  });
}
