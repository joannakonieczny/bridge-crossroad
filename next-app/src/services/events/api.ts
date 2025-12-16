"use server";

import {
  addEvent,
  addPairToTournamentEvent,
  addTeamToTournamentEvent,
  removePairFromTournamentEvent,
  removeTeamFromTournamentEvent,
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
import { getUserData } from "@/repositories/onboarding";
import { sendEmail } from "@/repositories/mailer";
import {
  tournamentRegistrationTemplate,
  tournamentUnregistrationTemplate,
} from "@/email-templates/pl/email-templates";

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
  .action(
    async ({ parsedInput: { eventId, pair, team }, ctx: { userId } }) => {
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
    },
    {
      onSuccess: async (d) => {
        const partnerId = d.ctx?.userId; // the user who enrolled the pair/team
        if (!d.data || !partnerId) return;

        const [eventPopulated, partner] = await Promise.all([
          getEventRepository({ eventId: d.data.id }),
          getUserData(partnerId),
        ]);
        const eventData = eventPopulated.data;

        if (eventData.type === EventType.TOURNAMENT_TEAMS) {
          const teamWithIds = d.parsedInput.team;
          if (!teamWithIds) return;
          const teamMembers = await Promise.all(
            teamWithIds.members.map((memberId) => getUserData(memberId))
          );
          Promise.all(
            teamMembers
              .filter((member) => member._id.toString() !== partnerId)
              .map((member) => {
                sendEmail({
                  userEmail: member.email,
                  ...tournamentRegistrationTemplate({
                    partner: {
                      firstName: partner.name.firstName,
                      nickname: partner.nickname,
                    },
                    person: {
                      firstName: member.name.firstName,
                      nickname: member.nickname,
                    },
                    tournamentEvent: {
                      title: eventPopulated.title,
                      description: eventPopulated.description,
                      location: eventPopulated.location,
                      additionalDescription:
                        eventPopulated.additionalDescription,
                      tournamentType: eventData.tournamentType,
                      duration: eventPopulated.duration,
                      organizer: {
                        firstName: eventPopulated.organizer.name.firstName,
                        nickname: eventPopulated.organizer.nickname,
                      },
                      group: {
                        name: eventPopulated.group.name,
                      },
                      typeOfEvent: EventType.TOURNAMENT_TEAMS,
                      team: {
                        name: teamWithIds.name,
                        members: teamMembers.map((m) => ({
                          firstName: m.name.firstName,
                          nickname: m.nickname,
                        })),
                      },
                    },
                  }),
                });
              })
          );
        } else if (eventData.type === EventType.TOURNAMENT_PAIRS) {
          const pair = d.parsedInput.pair;
          if (!pair) return;
          const secondFromPairId =
            pair.first === partnerId ? pair.second : pair.first;
          const secondFromPair = await getUserData(secondFromPairId);
          sendEmail({
            userEmail: secondFromPair.email,
            ...tournamentRegistrationTemplate({
              partner: {
                firstName: partner.name.firstName,
                nickname: partner.nickname,
              },
              person: {
                firstName: secondFromPair.name.firstName,
                nickname: secondFromPair.nickname,
              },
              tournamentEvent: {
                title: eventPopulated.title,
                description: eventPopulated.description,
                location: eventPopulated.location,
                additionalDescription: eventPopulated.additionalDescription,
                tournamentType: eventData.tournamentType,
                duration: eventPopulated.duration,
                organizer: {
                  firstName: eventPopulated.organizer.name.firstName,
                  nickname: eventPopulated.organizer.nickname,
                },
                group: {
                  name: eventPopulated.group.name,
                },
                typeOfEvent: EventType.TOURNAMENT_PAIRS,
              },
            }),
          });
        }
      },
    }
  );

export const unenrollFromEventTournament = withinOwnGroupAction
  .inputSchema(async (s) => s.merge(havingEventId))
  .use(async ({ next, ctx, clientInput }) => {
    const parseResult = havingEventId.safeParse(clientInput);
    if (!parseResult.success) {
      return returnValidationErrors(havingEventId, {
        eventId: {
          _errors: ["common.validation.invalidEventId"],
        },
      });
    }
    const { eventId } = parseResult.data;
    const event = await getEventRepository({ eventId });
    return next({ ctx: { ...ctx, event, eventId } });
  })
  .action(
    async ({ parsedInput: { eventId }, ctx: { userId, event } }) => {
      const eventType = event.data.type;

      switch (eventType) {
        case EventType.TOURNAMENT_PAIRS: {
          const res = await removePairFromTournamentEvent({
            eventId,
            userId,
          });
          return sanitizeEvent(res.event);
        }
        case EventType.TOURNAMENT_TEAMS: {
          const res = await removeTeamFromTournamentEvent({
            eventId,
            userId,
          });
          return sanitizeEvent(res.event);
        }
        default: {
          returnValidationErrors(havingEventId, {
            eventId: {
              _errors: [
                "validation.model.event.data.type.unsupportedTournamentType" satisfies TKey,
              ],
            },
          });
        }
      }
    },
    {
      onSuccess: async (d) => {
        const partnerId = d.ctx?.userId; // the user who unenrolled the pair/team
        const eventBeforeRemoval = d.ctx?.event; // event before removal from ctx
        if (!d.data || !partnerId || !eventBeforeRemoval) return;

        const partner = await getUserData(partnerId);
        const eventData = eventBeforeRemoval.data;

        if (eventData.type === EventType.TOURNAMENT_TEAMS) {
          const removedTeam = eventData.teams.find((team) =>
            team.members.some((member) => member._id.toString() === partnerId)
          );
          if (!removedTeam) return;

          const teamMembers = await Promise.all(
            removedTeam.members.map((member) =>
              getUserData(member._id.toString())
            )
          );

          Promise.all(
            teamMembers
              .filter((member) => member._id.toString() !== partnerId)
              .map((member) => {
                sendEmail({
                  userEmail: member.email,
                  ...tournamentUnregistrationTemplate({
                    partner: {
                      firstName: partner.name.firstName,
                      nickname: partner.nickname,
                    },
                    person: {
                      firstName: member.name.firstName,
                      nickname: member.nickname,
                    },
                    tournamentEvent: {
                      title: eventBeforeRemoval.title,
                      description: eventBeforeRemoval.description,
                      location: eventBeforeRemoval.location,
                      additionalDescription:
                        eventBeforeRemoval.additionalDescription,
                      tournamentType: eventData.tournamentType,
                      duration: eventBeforeRemoval.duration,
                      organizer: {
                        firstName: eventBeforeRemoval.organizer.name.firstName,
                        nickname: eventBeforeRemoval.organizer.nickname,
                      },
                      group: {
                        name: eventBeforeRemoval.group.name,
                      },
                      typeOfEvent: EventType.TOURNAMENT_TEAMS,
                      team: {
                        name: removedTeam.name,
                        members: teamMembers.map((m) => ({
                          firstName: m.name.firstName,
                          nickname: m.nickname,
                        })),
                      },
                    },
                  }),
                });
              })
          );
        } else if (eventData.type === EventType.TOURNAMENT_PAIRS) {
          const removedPair = eventData.contestantsPairs.find(
            (pair) =>
              pair.first._id.toString() === partnerId ||
              pair.second._id.toString() === partnerId
          );
          if (!removedPair) return;

          const secondFromPairId =
            removedPair.first._id.toString() === partnerId
              ? removedPair.second._id.toString()
              : removedPair.first._id.toString();
          const secondFromPair = await getUserData(secondFromPairId);

          sendEmail({
            userEmail: secondFromPair.email,
            ...tournamentUnregistrationTemplate({
              partner: {
                firstName: partner.name.firstName,
                nickname: partner.nickname,
              },
              person: {
                firstName: secondFromPair.name.firstName,
                nickname: secondFromPair.nickname,
              },
              tournamentEvent: {
                title: eventBeforeRemoval.title,
                description: eventBeforeRemoval.description,
                location: eventBeforeRemoval.location,
                additionalDescription: eventBeforeRemoval.additionalDescription,
                tournamentType: eventData.tournamentType,
                duration: eventBeforeRemoval.duration,
                organizer: {
                  firstName: eventBeforeRemoval.organizer.name.firstName,
                  nickname: eventBeforeRemoval.organizer.nickname,
                },
                group: {
                  name: eventBeforeRemoval.group.name,
                },
                typeOfEvent: EventType.TOURNAMENT_PAIRS,
              },
            }),
          });
        }
      },
    }
  );
