"use server";

import {
  addEvent,
  addPairToTournamentEvent,
  addTeamToTournamentEvent,
} from "@/repositories/event-group";
import {
  withinOwnGroupAction,
  withinOwnGroupAsAdminAction,
} from "../action-lib";
import {
  addEventSchema,
  enrollToEventTournamentSchema,
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
import { EventType } from "@/club-preset/event-type";
import { returnValidationErrors } from "next-safe-action";
import type { TKey } from "@/lib/typed-translations";

export const createEvent = withinOwnGroupAsAdminAction
  .inputSchema(async (s) => s.merge(addEventSchema))
  .action(async ({ parsedInput: eventData, ctx: { groupId } }) => {
    const res = await addEvent({ groupId, event: eventData });
    return sanitizeEvent(res.event);
  });

export const deleteEvent = withinOwnGroupAsAdminAction
  .inputSchema(async (s) => s.merge(havingEventId))
  .action(async ({ parsedInput: { eventId }, ctx: { groupId } }) => {
    const res = await removeEvent({ groupId, eventId });
    return sanitizeEvent(res.event);
  });

export const updateEvent = withinOwnGroupAsAdminAction
  .inputSchema(async (s) =>
    s.merge(havingEventId.merge(z.object({ changes: modifyEventSchema })))
  )
  .action(async ({ parsedInput: { eventId, changes }, ctx: { groupId } }) => {
    const res = await updateEventRepo({ groupId, eventId, changes });
    return sanitizeEvent(res.event);
  });

export const addAttendee = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(havingEventId))
  .action(async ({ parsedInput: { eventId }, ctx: { userId } }) => {
    const res = await addAttendeeToEvent({ eventId, userId });
    return sanitizeEvent(res.event);
  });

export const removeAttendee = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(havingEventId))
  .action(async ({ parsedInput: { eventId }, ctx: { userId } }) => {
    const res = await removeAttendeeFromEvent({ eventId, userId });
    return sanitizeEvent(res.event);
  });

export const listEventsForGroup = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(z.object({ timeWindow: timeWindowSchema })))
  .action(async ({ parsedInput: { timeWindow }, ctx: { groupId } }) => {
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

export const enrollToEventTournament = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(enrollToEventTournamentSchema))
  .action(async ({ parsedInput: { eventId, pair, team }, ctx: { userId } }) => {
    const event = await getEventRepository({ eventId });
    const eventType = event.data.type;
    switch (eventType) {
      case EventType.TOURNAMENT_PAIRS: {
        if (!pair)
          returnValidationErrors(enrollToEventTournamentSchema, {
            pair: {
              _errors: [
                "validation.model.event.data.type.pair.required" satisfies TKey,
              ],
            },
          });
        if (pair.first !== userId && pair.second !== userId) {
          returnValidationErrors(enrollToEventTournamentSchema, {
            pair: {
              _errors: [
                "validation.model.event.data.type.pair.userNotInPair" satisfies TKey,
              ],
            },
          });
        }
        const res = await addPairToTournamentEvent({
          eventId,
          pair,
        });
        return sanitizeEvent(res.event);
      }
      case EventType.TOURNAMENT_TEAMS: {
        const teamValidationError = (messageKey: string) =>
          returnValidationErrors(enrollToEventTournamentSchema, {
            team: {
              _errors: [messageKey],
            },
          });

        if (!team) {
          return teamValidationError(
            "validation.model.event.data.type.team.required" satisfies TKey
          );
        }
        if (event.data.teams.find((t) => t.name === team.name)) {
          return teamValidationError(
            "validation.model.event.data.type.team.teamNameTaken" satisfies TKey
          );
        }
        if (!team.members.includes(userId)) {
          return teamValidationError(
            "validation.model.event.data.type.team.userNotInTeam" satisfies TKey
          );
        }
        const res = await addTeamToTournamentEvent({
          eventId,
          team,
        });

        return sanitizeEvent(res.event);
      }
      default: {
        returnValidationErrors(enrollToEventTournamentSchema, {
          eventId: {
            _errors: [
              "validation.model.event.data.type.unsupportedTournamentType" satisfies TKey,
            ],
          },
        });
      }
    }
  });
