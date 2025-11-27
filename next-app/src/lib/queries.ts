import dayjs from "dayjs";
import { useToast } from "@chakra-ui/react";
import { useGetMessageFromError } from "./tanstack-action/hooks-helpers";
import { useActionQuery } from "./tanstack-action/actions-querry";
import {
  getJoinedGroupsInfo,
  getGroupData,
  getJoinedGroupsInfoAsAdmin,
} from "@/services/groups/api";
import { getUser } from "@/services/onboarding/api";
import {
  listEventsForUser,
  getEvent,
  getLatestEventsForUser,
} from "@/services/events/api";
import { listPartnershipPosts } from "@/services/find-partner/api";
import {
  PartnershipPostStatus,
  PartnershipPostType,
} from "@/club-preset/partnership-post";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { EventIdType } from "@/schemas/model/event/event-types";
import type {
  ActionError,
  TActionQueryOptionsHelper,
} from "./tanstack-action/types";

export const QUERY_KEYS = {
  userInfo: ["user", "info"],
  joinedGroups: ["groups"],
  joinedGroupsAsAdmin: ["groups", "adminOnly"],
  groupDetail: (id: GroupIdType) => ["groups", id],
  calendarEvents: (start: Date, end: Date) => [
    "event",
    `${dayjs(start).format("DD/MM/YYYY")}|${dayjs(end).format("DD/MM/YYYY")}`,
  ],
  eventDetail: (id: EventIdType) => ["event", id],
  latestEvents: (limit: number) => ["event", "latest", limit],
  partnershipPosts: ["partnershipPosts"],
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
  const e = useOnErrorToast("grup do których należysz", "getJoinedGroupsInfo");
  return useActionQuery({
    queryKey: QUERY_KEYS.joinedGroups,
    action: getJoinedGroupsInfo,
    onError: e,
    ...props,
  });
}

export function useJoinedGroupsAsAdminQuery(
  props?: TActionQueryOptionsHelper<typeof getJoinedGroupsInfoAsAdmin>
) {
  const e = useOnErrorToast(
    "grup do których należysz (admin)",
    "getJoinedGroupsInfoAsAdmin"
  );
  return useActionQuery({
    queryKey: QUERY_KEYS.joinedGroupsAsAdmin,
    action: getJoinedGroupsInfoAsAdmin,
    onError: e,
    ...props,
  });
}

export function useUserInfoQuery(
  props?: TActionQueryOptionsHelper<typeof getUser>
) {
  const e = useOnErrorToast("informacji o użytkowniku", "getUser");
  return useActionQuery({
    queryKey: QUERY_KEYS.userInfo,
    action: getUser,
    onError: e,
    ...props,
  });
}

export function useGroupQuery(
  groupId: GroupIdType | null,
  props?: TActionQueryOptionsHelper<typeof getGroupData>
) {
  const e = useOnErrorToast("szczegółów grupy", "getGroupData");
  return useActionQuery({
    queryKey: QUERY_KEYS.groupDetail(groupId || ""),
    action: () => getGroupData({ groupId: groupId || "" }),
    enabled: groupId ? true : false,
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
  eventId: EventIdType | null,
  props?: TActionQueryOptionsHelper<typeof getEvent>
) {
  const e = useOnErrorToast("szczegółów wydarzenia", "getEvent");
  return useActionQuery({
    queryKey: QUERY_KEYS.eventDetail(eventId || ""),
    action: () => getEvent({ eventId: eventId || "" }),
    enabled: eventId ? true : false,
    onError: e,
    ...props,
  });
}

export function usePartnershipPostsQuery(
  input?: {
    groupId?: GroupIdType;
    page?: number;
    limit?: number;
    status?: PartnershipPostStatus;
    type?: PartnershipPostType;
    onboardingData?: any;
    onboardingBucket?: string;
  },
  props?: TActionQueryOptionsHelper<typeof listPartnershipPosts>
) {
  const e = useOnErrorToast(
    "ogłoszeń szukania partnera",
    "listPartnershipPosts"
  );

  const page = input?.page ?? 1;
  const limit = input?.limit ?? 10;
  const status = input?.status ?? PartnershipPostStatus.ACTIVE;
  const groupId = input?.groupId ?? ("" as GroupIdType);
  console.log(groupId);
  const type = input?.type;
  const onboardingData = input?.onboardingData;
  const onboardingKey = input?.onboardingBucket ?? "none";

  return useActionQuery({
    // use onboardingKey (primitive) instead of full object to prevent excessive ref-triggered fetches
    queryKey: [
      "partnershipPosts",
      page,
      groupId,
      limit,
      status,
      type,
      onboardingKey,
    ],
    action: () =>
      listPartnershipPosts({
        status,
        page,
        limit,
        type: input?.type,
        onboardingData: onboardingData,
        groupId,
      }),
  });
}

export function useRecentEventsQuery(
  limit: number,
  props?: TActionQueryOptionsHelper<typeof getLatestEventsForUser>
) {
  const e = useOnErrorToast("najnowszych wydarzeń", "getLatestEventsForUser");
  return useActionQuery({
    queryKey: QUERY_KEYS.latestEvents(limit),
    action: () => getLatestEventsForUser({ limit }),
    onError: e,
    ...props,
  });
}
