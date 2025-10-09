"use server";

import { addEvent } from "@/repositories/event-group";
import {
  getWithinOwnGroupAction,
  getWithinOwnGroupAsAdminAction,
} from "../action-lib";
import {
  addModifyEventSchema,
  timeWindowSchema,
} from "@/schemas/pages/with-onboarding/events/events-schema";
import { sanitizeEvent } from "@/sanitizers/server-only/event-sanitize";
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

export const createEvent = getWithinOwnGroupAsAdminAction(
  addModifyEventSchema
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
  havingEventId.merge(z.object({ changes: addModifyEventSchema.partial() }))
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
