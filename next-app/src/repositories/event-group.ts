"server-only";

import dbConnect from "@/util/connect-mongo";
import Event from "@/models/event/event-model";
import Group from "@/models/group/group-model";
import User from "@/models/user/user-model";
import { UserTableName } from "@/models/user/user-types";
import { GroupTableName } from "@/models/group/group-types";
import { executeWithinTransaction, check, checkTrue } from "./common";
import type { IUserDTO } from "@/models/user/user-types";
import type { FilterQuery } from "mongoose";
import type { IGroupDTO } from "@/models/group/group-types";
import type { WithSession } from "./common";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type {
  ITournamentPairsData,
  ITournamentTeamsData,
} from "@/models/event/event-types";
import type {
  EventIdType,
  PlayingPairType,
  PlayingTeamType,
} from "@/schemas/model/event/event-types";
import type { IEventDTO } from "@/models/event/event-types";
import type {
  AddEventSchemaType,
  ModifyEventSchemaType,
} from "@/schemas/pages/with-onboarding/events/events-types";
import type { UserIdType } from "@/schemas/model/user/user-types";
import type { IEventPopulated } from "@/models/mixed-types";
import { EventType } from "@/club-preset/event-type";

type AddEventInput = {
  groupId: GroupIdType;
  event: AddEventSchemaType;
};

export async function addEvent({
  groupId,
  event,
  session,
}: AddEventInput & WithSession) {
  await dbConnect();

  return executeWithinTransaction(async (s) => {
    // ensure organizer (if provided) is a member of the group
    const groupForCheck = check(
      await Group.findById(groupId).session(s).lean<IGroupDTO>(),
      `Group not found with id: ${groupId}`
    );

    checkTrue(
      groupForCheck.members.map((m) => m.toString()).includes(event.organizer),
      "Event organizer must be a member of the group"
    );

    // create new event and ensure it's bound to the group
    const newEventDoc = new Event({ ...event, group: groupId });
    await newEventDoc.save({ session: s });

    const updatedGroup = check(
      await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { events: newEventDoc._id } },
        { new: true, session: s }
      ).lean<IGroupDTO>(),
      "Failed to add event to group: group not found"
    );

    return {
      event: newEventDoc.toObject() as IEventDTO,
      group: updatedGroup,
    };
  }, session);
}

type RemoveEventInput = {
  groupId: GroupIdType;
  eventId: EventIdType;
};

export async function removeEvent({
  groupId,
  eventId,
  session,
}: RemoveEventInput & WithSession) {
  await dbConnect();

  return executeWithinTransaction(async (s) => {
    // ensure event exists and belongs to the group
    const existingEvent = check(
      await Event.findById(eventId).session(s).lean<IEventDTO>(),
      `Event not found with id: ${eventId}`
    );

    checkTrue(
      existingEvent.group.toString() === groupId,
      "Event does not belong to the provided group"
    );

    // delete event
    const deletedEvent = check(
      await Event.findByIdAndDelete(eventId, {
        session: s,
      }).lean<IEventDTO>(),
      `Failed to delete event with id: ${eventId}`
    );

    const updatedGroup = check(
      await Group.findByIdAndUpdate(
        groupId,
        { $pull: { events: eventId } },
        { new: true, session: s }
      ).lean<IGroupDTO>(),
      "Failed to update group after removing event"
    );

    return {
      event: deletedEvent,
      group: updatedGroup,
    };
  }, session);
}

type UpdateEventInput = {
  groupId: GroupIdType;
  eventId: EventIdType;
  changes: Partial<ModifyEventSchemaType>;
};

export async function updateEvent({
  groupId,
  eventId,
  changes,
  session,
}: UpdateEventInput & WithSession) {
  await dbConnect();

  return executeWithinTransaction(async (s) => {
    // ensure event exists and belongs to the group
    const existingEvent = check(
      await Event.findById(eventId).session(s).lean<IEventDTO>(),
      `Event not found with id: ${eventId}`
    );

    checkTrue(
      existingEvent.group.toString() === groupId,
      "Event does not belong to the provided group"
    );

    // if organizer is being changed, ensure the new organizer is a member of the group
    if (changes.organizer) {
      const groupForCheck = check(
        await Group.findById(groupId).session(s).lean<IGroupDTO>(),
        `Group not found with id: ${groupId}`
      );

      checkTrue(
        groupForCheck.members
          .map((m) => m?.toString())
          .includes(changes.organizer),
        "Event organizer must be a member of the group"
      );
    }

    const updated = check(
      await Event.findByIdAndUpdate(
        eventId,
        { $set: changes },
        { new: true, session: s, runValidators: true }
      ).lean<IEventDTO>(),
      `Failed to update event with id: ${eventId}`
    );

    return { event: updated };
  }, session);
}

type AddAttendeeInput = {
  eventId: EventIdType;
  userId: UserIdType;
};

export async function addAttendeeToEvent({
  eventId,
  userId,
  session,
}: AddAttendeeInput & WithSession) {
  await dbConnect();

  return executeWithinTransaction(async (s) => {
    const existingEvent = check(
      await Event.findById(eventId).session(s).lean<IEventDTO>(),
      `Event not found with id: ${eventId}`
    );

    // optionally ensure the user is a member of the group before attending
    const group = check(
      await Group.findById(existingEvent.group.toString())
        .session(s)
        .lean<IGroupDTO>(),
      `Group not found for event with id: ${eventId}`
    );

    checkTrue(
      group.members.map((m) => m?.toString()).includes(userId.toString()),
      "User must be a member of the group to attend the event"
    );

    const updatedEvent = check(
      await Event.findByIdAndUpdate(
        eventId,
        { $addToSet: { attendees: userId } },
        { new: true, session: s }
      ).lean<IEventDTO>(),
      `Failed to add attendee to event ${eventId}`
    );

    return { event: updatedEvent };
  }, session);
}

export async function removeAttendeeFromEvent({
  eventId,
  userId,
}: AddAttendeeInput) {
  await dbConnect();

  const existingEvent = check(
    await Event.findById(eventId).lean<IEventDTO | null>(),
    `Event not found with id: ${eventId}`
  );

  // ensure user is currently an attendee
  checkTrue(
    existingEvent.attendees
      .map((a) => a?.toString())
      .includes(userId.toString()),
    "User is not an attendee of this event"
  );

  const updatedEvent = check(
    await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: userId } },
      { new: true }
    ).lean<IEventDTO>(),
    `Failed to remove attendee from event ${eventId}`
  );

  return { event: updatedEvent };
}

export async function getEvent({ eventId }: { eventId: EventIdType }) {
  await dbConnect();

  const existingEvent = check(
    await Event.findById(eventId)
      .populate<IEventPopulated>([
        { path: "organizer", model: UserTableName },
        { path: "attendees", model: UserTableName },
        { path: "group", model: GroupTableName },

        // Tournament pair & teams
        { path: "data.arbiter", model: UserTableName },
        {
          path: "data.contestantsPairs",
          populate: [
            {
              path: "first",
              model: UserTableName,
            },
            {
              path: "second",
              model: UserTableName,
            },
          ],
        },
        {
          path: "data.teams",
          populate: [
            {
              path: "members",
              model: UserTableName,
            },
          ],
        },

        // League meeting sessions
        {
          path: "data.session",
          populate: [
            {
              path: "contestants.firstPair.first",
              model: UserTableName,
            },
            {
              path: "contestants.firstPair.second",
              model: UserTableName,
            },
            {
              path: "contestants.secondPair.first",
              model: UserTableName,
            },
            {
              path: "contestants.secondPair.second",
              model: UserTableName,
            },
          ],
        },

        // Training
        { path: "data.coach", model: UserTableName },
      ])
      .lean<IEventPopulated>(),
    `Event not found with id: ${eventId}`
  );

  check(existingEvent.organizer, "Event organizer data is missing");
  check(existingEvent.group, "Event group data is missing");
  existingEvent.attendees.forEach((a) =>
    check(a, "Event attendee data is missing")
  );

  switch (existingEvent.data.type) {
    case EventType.TOURNAMENT_PAIRS: {
      const template = (pair: string) =>
        `Pair tournament ${pair} player data is missing`;
      existingEvent.data.contestantsPairs.forEach((pair) => {
        check(pair.first, template("first"));
        check(pair.second, template("second"));
      });
      break;
    }
    case EventType.TOURNAMENT_TEAMS: {
      const template = (teamName: string) =>
        `Team tournament team ${teamName} member data is missing`;
      existingEvent.data.teams.forEach((team) => {
        team.members.forEach((member) => check(member, template(team.name)));
      });
      break;
    }
    case EventType.LEAGUE_MEETING: {
      const template = (pair: string, position: string) =>
        `League meeting session ${pair} pair: ${position} contestant data is missing`;

      existingEvent.data.session.forEach((s) => {
        check(s.contestants.firstPair.first, template("first", "first"));
        check(s.contestants.firstPair.second, template("first", "second"));
        check(s.contestants.secondPair.first, template("second", "first"));
        check(s.contestants.secondPair.second, template("second", "second"));
      });
      break;
    }
  }
  return existingEvent;
}

type TimeWindow = {
  start?: Date;
  end?: Date;
};

type ListEventsInput = {
  groupId: GroupIdType;
  timeWindow?: TimeWindow;
};

export async function listEventsInGroup({
  groupId,
  timeWindow,
}: ListEventsInput) {
  await dbConnect();
  // Build date filter for overlapping intervals
  const dateConditions: FilterQuery<IEventDTO>[] = [];

  const start = timeWindow?.start;
  const end = timeWindow?.end;

  // If start is provided, require events that end at or after start
  if (start) {
    dateConditions.push({ "duration.endsAt": { $gte: new Date(start) } });
  }

  // If end is provided, require events that start at or before end
  if (end) {
    dateConditions.push({ "duration.startsAt": { $lte: new Date(end) } });
  }

  const querry: FilterQuery<IEventDTO> = { group: groupId };
  if (dateConditions.length > 0) {
    querry.$and = dateConditions;
  }

  const res = await Event.find(querry)
    .sort({ "duration.startsAt": 1 })
    .lean<IEventDTO[]>();

  return check(res, `Failed to list events for group ${groupId}`);
}

export async function listEventsForUserGroups(
  userId: string,
  timeWindow?: TimeWindow
) {
  await dbConnect();

  // find user and extract group ids
  const user = check(
    await User.findById(userId).lean<IUserDTO | null>(),
    `User not found with id: ${userId}`
  );

  const groupIds = (user.groups || []).map((g) => g?.toString());

  // if user has no groups, return empty array early
  if (groupIds.length === 0) {
    return {
      events: [] as IEventDTO[],
      groupIds,
    };
  }

  // Build date filter for overlapping intervals
  const dateConditions: FilterQuery<IEventDTO>[] = [];
  const start = timeWindow?.start;
  const end = timeWindow?.end;

  if (start)
    dateConditions.push({ "duration.endsAt": { $gte: new Date(start) } });
  if (end)
    dateConditions.push({ "duration.startsAt": { $lte: new Date(end) } });

  const query: FilterQuery<IEventDTO> = { group: { $in: groupIds } };
  if (dateConditions.length > 0) query.$and = dateConditions;

  const events = check(
    await Event.find(query)
      .sort({ "duration.startsAt": 1 })
      .lean<IEventDTO[]>(),
    `Failed to list events for user's groups: ${userId}`
  );

  return {
    events,
    groupIds,
  };
}

type GetLatestEventsInput = {
  userId: UserIdType;
  limit: number;
};

export async function getLatestEventsForUser({
  userId,
  limit,
}: GetLatestEventsInput) {
  await dbConnect();

  const user = check(
    await User.findById(userId).lean<IUserDTO>(),
    `User not found with id: ${userId}`
  );

  const groupIds = user.groups.map((g) => g?.toString());

  // if user has no groups, return empty array early
  if (groupIds.length === 0) {
    return [];
  }

  // find the latest k events from user's groups, sorted by start date descending
  const now = new Date();
  const events = check(
    await Event.find({
      group: { $in: groupIds },
      "duration.endsAt": { $gte: now },
    })
      .sort({ "duration.startsAt": -1 })
      .limit(limit)
      .lean<IEventDTO[]>(),
    `Failed to fetch latest events for user: ${userId}`
  );

  return events;
}

type AddTeamToTournamentEventInput = {
  eventId: EventIdType;
  team: PlayingTeamType;
};

export async function addTeamToTournamentEvent({
  eventId,
  team,
}: AddTeamToTournamentEventInput) {
  await dbConnect();
  const existingEvent = await Event.findById(eventId);

  check(existingEvent, `Event not found with id: ${eventId}`);
  checkTrue(
    existingEvent.data.type === EventType.TOURNAMENT_TEAMS,
    "Event must be of type TOURNAMENT_TEAMS to add a team"
  );

  const { teams: existingTeams } = existingEvent.data as ITournamentTeamsData;

  checkTrue(
    !existingTeams.some((t) => t.name === team.name),
    `Team name ${team.name} already exists`
  );
  checkTrue(
    !existingTeams.some((t) =>
      t.members.some((member) => team.members.includes(member.toString()))
    ),
    `One or more team members are already in another team`
  );

  checkTrue(
    team.members.length === new Set(team.members).size,
    "All team members must be unique"
  );

  const existingGroup = check(
    await Group.findById(existingEvent.group.toString()).lean<IGroupDTO>(),
    `Group not found for event with id: ${eventId}`
  );
  const groupMemberIds = new Set(
    existingGroup.members.map((m) => m.toString())
  );
  team.members.forEach((memberId) => {
    checkTrue(
      groupMemberIds.has(memberId.toString()),
      `Team member ${memberId} must be a member of the group`
    );
  });

  (existingEvent.data as ITournamentTeamsData).teams.push({
    name: team.name,
    members: team.members,
  } as (typeof existingEvent.data.teams)[0]);

  await existingEvent.save();

  const savedEvent = existingEvent.toObject() as IEventDTO;

  return { event: savedEvent };
}

type AddPairToTournamentEventInput = {
  eventId: EventIdType;
  pair: PlayingPairType;
};

export async function addPairToTournamentEvent({
  eventId,
  pair,
}: AddPairToTournamentEventInput) {
  await dbConnect();
  const existingEvent = await Event.findById(eventId);

  check(existingEvent, `Event not found with id: ${eventId}`);
  checkTrue(
    existingEvent.data.type === EventType.TOURNAMENT_PAIRS,
    "Event must be of type TOURNAMENT_PAIRS to add a pair"
  );
  // ensure pair members are distinct
  checkTrue(
    pair.first.toString() !== pair.second.toString(),
    "Pair members must be two different users"
  );

  // ensure no member of the new pair is already enrolled in another pair
  const { contestantsPairs: existingPairs } =
    existingEvent.data as ITournamentPairsData;

  checkTrue(
    !existingPairs.some((p) =>
      [p?.first, p?.second].some(
        (m) =>
          m?.toString() === pair.first.toString() ||
          m?.toString() === pair.second.toString()
      )
    ),
    "One or more pair members are already enrolled in another pair"
  );
  const existingGroup = check(
    await Group.findById(existingEvent.group.toString()).lean<IGroupDTO>(),
    `Group not found for event with id: ${eventId}`
  );
  const groupMemberIds = new Set(
    existingGroup.members.map((m) => m.toString())
  );
  checkTrue(
    groupMemberIds.has(pair.first.toString()),
    `First player ${pair.first} must be a member of the group`
  );
  checkTrue(
    groupMemberIds.has(pair.second.toString()),
    `Second player ${pair.second} must be a member of the group`
  );

  (existingEvent.data as ITournamentPairsData).contestantsPairs.push({
    first: pair.first,
    second: pair.second,
  } as (typeof existingEvent.data.contestantsPairs)[0]);

  await existingEvent.save();

  const savedEvent = existingEvent.toObject() as IEventDTO;

  return { event: savedEvent };
}

type RemovePairFromTournamentEventInput = {
  eventId: EventIdType;
  userId: UserIdType;
};

export async function removePairFromTournamentEvent({
  eventId,
  userId,
}: RemovePairFromTournamentEventInput) {
  await dbConnect();
  const existingEvent = await Event.findById(eventId);

  check(existingEvent, `Event not found with id: ${eventId}`);
  checkTrue(
    existingEvent.data.type === EventType.TOURNAMENT_PAIRS,
    "Event must be of type TOURNAMENT_PAIRS to remove a pair"
  );

  const { contestantsPairs } = existingEvent.data as ITournamentPairsData;

  // Find the pair that contains the user
  const pairIndex = contestantsPairs.findIndex(
    (p) =>
      p?.first?.toString() === userId.toString() ||
      p?.second?.toString() === userId.toString()
  );

  checkTrue(
    pairIndex !== -1,
    `User ${userId} is not enrolled in any pair for this tournament`
  );

  // Remove the entire pair
  (existingEvent.data as ITournamentPairsData).contestantsPairs.splice(
    pairIndex,
    1
  );

  await existingEvent.save();

  const savedEvent = existingEvent.toObject() as IEventDTO;

  return { event: savedEvent };
}

type RemoveTeamFromTournamentEventInput = {
  eventId: EventIdType;
  userId: UserIdType;
};

export async function removeTeamFromTournamentEvent({
  eventId,
  userId,
}: RemoveTeamFromTournamentEventInput) {
  await dbConnect();
  const existingEvent = await Event.findById(eventId);

  check(existingEvent, `Event not found with id: ${eventId}`);
  checkTrue(
    existingEvent.data.type === EventType.TOURNAMENT_TEAMS,
    "Event must be of type TOURNAMENT_TEAMS to remove a team"
  );

  const { teams } = existingEvent.data as ITournamentTeamsData;

  // Find the team that contains the user
  const teamIndex = teams.findIndex((t) =>
    t.members.some((member) => member.toString() === userId.toString())
  );

  checkTrue(
    teamIndex !== -1,
    `User ${userId} is not enrolled in any team for this tournament`
  );

  // Remove the entire team
  (existingEvent.data as ITournamentTeamsData).teams.splice(teamIndex, 1);

  await existingEvent.save();

  const savedEvent = existingEvent.toObject() as IEventDTO;

  return { event: savedEvent };
}
