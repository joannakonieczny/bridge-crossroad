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
  },
  groups: {
    index: "/groups",
    groupDetails: (id: string) => `/groups/${id}`,
    chat: "/groups/chat",
    materials: "/groups/materials",
    hands: "/groups/hands",
  },
  find_partner: "/find-partner",
  tools: "/tools",
} as const;

export type RouteKeys = (typeof ROUTES)[keyof typeof ROUTES];
