import dayjs from "dayjs";
import { useActionQuery } from "./tanstack-action/actions-querry";
import { getJoinedGroupsInfo, getGroupData } from "@/services/groups/api";
import { listEventsForUser, getEvent } from "@/services/events/api";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { EventIdType } from "@/schemas/model/event/event-types";
import type {
  ActionError,
  TActionQueryOptionsHelper,
} from "./tanstack-action/types";
import { useToast } from "@chakra-ui/react";
import { useGetMessageFromError } from "./tanstack-action/hooks-helpers";

export const QUERY_KEYS = {
  joinedGroups: ["groups"],
  groupDetail: (id: GroupIdType) => ["groups", id],
  calendarEvents: (start: Date, end: Date) => [
    "events",
    `${dayjs(start).format("DD/MM/YYYY")}|${dayjs(end).format("DD/MM/YYYY")}`,
  ],
  eventDetail: (id: EventIdType) => ["event", id],
} as const;

function useOnErrorToast(template: string, toastId: string) {
  const toast = useToast();
  const g = useGetMessageFromError(template);
  const id = "q-error-toast" + toastId;

  const helper = (e: ActionError) => {
    if (toast.isActive(id)) return;
    toast({
      status: "error",
      title: g(e),
      id,
    });
  };
  return helper;
}

export function useJoinedGroupsQuery(
  props?: TActionQueryOptionsHelper<typeof getJoinedGroupsInfo>
) {
  const e = useOnErrorToast(
    "grup w których jesteś administratorem",
    "getJoinedGroupsInfo"
  );
  return useActionQuery({
    queryKey: QUERY_KEYS.joinedGroups,
    action: getJoinedGroupsInfo,
    onError: e,
    ...props,
  });
}

export function useGroupQuery(
  groupId: GroupIdType,
  props?: TActionQueryOptionsHelper<typeof getGroupData>
) {
  const e = useOnErrorToast("szczegółów grupy", "getGroupData");
  return useActionQuery({
    queryKey: QUERY_KEYS.groupDetail(groupId),
    action: () => getGroupData({ groupId }),
    onError: e,
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
  const e = useOnErrorToast("wydarzeń w kalendarzu", "listEventsForUser");
  return useActionQuery({
    queryKey: QUERY_KEYS.calendarEvents(timeWindow.start, timeWindow.end),
    action: () => listEventsForUser({ timeWindow }),
    onError: e,
    ...props,
  });
}

export function useEventQuery(
  eventId: EventIdType,
  props?: TActionQueryOptionsHelper<typeof getEvent>
) {
  const e = useOnErrorToast("szczegółów wydarzenia", "getEvent");
  return useActionQuery({
    queryKey: QUERY_KEYS.eventDetail(eventId),
    action: () => getEvent({ eventId }),
    onError: e,
    ...props,
  });
}

export function useEventPageQuery(eventId?: string) {
  const onError = useOnErrorToast("szczegółów wydarzenia", "getEventPage");
  return useActionQuery({
    queryKey: ["event", eventId ?? "none"],
    action: () => getEvent({ eventId: eventId as EventIdType }),
    enabled: !!eventId,
    onError,
  });
}
