import type { EventIdType } from "./schemas/model/event/event-types";
import type { GroupIdType } from "./schemas/model/group/group-types";

export const ROUTES = {
  landing_page: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgot_password: "/auth/forgot-password",
  },
  onboarding: {
    index: "/onboarding",
    step_1: "/onboarding/1",
    step_2: "/onboarding/2",
    step_3: "/onboarding/3",
    final: "/onboarding/final",
  },
  dashboard: "/dashboard",
  calendar: {
    index: "/calendar",
    upcoming_events: "/calendar/upcoming-events",
    eventDetails: (id: EventIdType) => `/calendar/${id}`,
  },
  groups: {
    index: "/groups",
    groupDetails: (id: GroupIdType) => `/groups/${id}`,
    chat: (id: GroupIdType) => `/groups/${id}/chat`,
    materials: (id: GroupIdType) => `/groups/${id}/materials`,
    hands: (id: GroupIdType) => `/groups/${id}/hands`,
  },
  find_partner: "/find-partner",
  tools: "/tools",
} as const;

export type RouteKeys = (typeof ROUTES)[keyof typeof ROUTES];
