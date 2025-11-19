"use server";

import { addEvent } from "@/repositories/event-group";
import {
  getWithinOwnGroupAction,
  getWithinOwnGroupAsAdminAction,
} from "../action-lib";
import {
  addEventSchema,
  modifyEventSchema,
  timeWindowSchema,
} from "@/schemas/pages/with-onboarding/events/events-schema";
import {
  sanitizeEvent,
  sanitizeEventPopulated,
} from "@/sanitizers/server-only/event-sanitize";
import { havingEventId } from "@/schemas/model/event/event-schema";
import {
  removeEvent,
  updateEvent as updateEventRepo,
} from "@/repositories/event-group";
import { listEventsInGroup } from "@/repositories/event-group";
import {
  addAttendeeToEvent,
  removeAttendeeFromEvent,
} from "@/repositories/event-group";
import { z } from "zod";
import { fullAuthAction } from "../action-lib";
import { listEventsForUserGroups } from "@/repositories/event-group";
import { getEvent as getEventRepository } from "@/repositories/event-group";
import { getLatestEventsForUser as getLatestEventsForUserRepo } from "@/repositories/event-group";
import { requireGroupAccess } from "../groups/simple-action";

export const createEvent = getWithinOwnGroupAsAdminAction(
  addEventSchema
).action(async ({ parsedInput: eventData, ctx: { groupId } }) => {
  const res = await addEvent({ groupId, event: eventData });
  return sanitizeEvent(res.event);
});

export const deleteEvent = getWithinOwnGroupAsAdminAction(havingEventId).action(
  async ({ parsedInput: { eventId }, ctx: { groupId } }) => {
    const res = await removeEvent({ groupId, eventId });
    return sanitizeEvent(res.event);
  }
);

export const updateEvent = getWithinOwnGroupAsAdminAction(
  havingEventId.merge(z.object({ changes: modifyEventSchema }))
).action(async ({ parsedInput: { eventId, changes }, ctx: { groupId } }) => {
  const res = await updateEventRepo({ groupId, eventId, changes });
  return sanitizeEvent(res.event);
});

export const addAttendee = getWithinOwnGroupAction(havingEventId).action(
  async ({ parsedInput: { eventId }, ctx: { userId } }) => {
    const res = await addAttendeeToEvent({ eventId, userId });
    return sanitizeEvent(res.event);
  }
);

export const removeAttendee = getWithinOwnGroupAction(havingEventId).action(
  async ({ parsedInput: { eventId }, ctx: { userId } }) => {
    const res = await removeAttendeeFromEvent({ eventId, userId });
    return sanitizeEvent(res.event);
  }
);

export const listEventsForGroup = getWithinOwnGroupAction(
  z.object({ timeWindow: timeWindowSchema })
).action(async ({ parsedInput: { timeWindow }, ctx: { groupId } }) => {
  const res = await listEventsInGroup({ groupId, timeWindow });
  return res.map(sanitizeEvent);
});

export const listEventsForUser = fullAuthAction
  .inputSchema(z.object({ timeWindow: timeWindowSchema }))
  .action(async ({ parsedInput: { timeWindow }, ctx: { userId } }) => {
    const res = await listEventsForUserGroups(userId, timeWindow);
    return {
      events: res.events.map(sanitizeEvent),
      groupIds: res.groupIds.map(toString),
    };
  });

export const getEvent = fullAuthAction
  .inputSchema(havingEventId)
  .action(async ({ parsedInput: { eventId }, ctx }) => {
    const res = await getEventRepository({ eventId });
    await requireGroupAccess({
      groupId: res.group._id.toString(),
      userId: ctx.userId,
    });
    return sanitizeEventPopulated(res, ctx.userId);
  });

export const getLatestEventsForUser = fullAuthAction
  .inputSchema(z.object({ limit: z.number().int().positive().default(10) }))
  .action(async ({ parsedInput: { limit }, ctx: { userId } }) => {
    const events = await getLatestEventsForUserRepo({ userId, limit });
    return events.map(sanitizeEvent);
  });
