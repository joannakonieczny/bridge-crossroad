"server-only";

import Event from "@/models/event/event-model";
import Group from "@/models/group/group-model";

import dbConnect from "@/util/connect-mongo";
import { RepositoryError, executeWithinTransaction, check } from "./common";
import type { IGroupDTO } from "@/models/group/group-types";
import type { WithSession } from "./common";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { IEventDTO } from "@/models/event/event-types";
import type { AddModifyEventSchemaType } from "@/schemas/pages/with-onboarding/events/events-types";
import type { EventIdType } from "@/schemas/model/event/event-types";

type AddEventInput = {
  groupId: GroupIdType;
  event: AddModifyEventSchemaType;
};

export async function addEvent({
  groupId,
  event,
  session,
}: AddEventInput & WithSession) {
  await dbConnect();

  return executeWithinTransaction(async (s) => {
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

    // verify ownership
    if (existingEvent.group.toString() !== groupId) {
      throw new RepositoryError("Event does not belong to the provided group");
    }

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
  changes: Partial<AddModifyEventSchemaType>;
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

    if (existingEvent.group.toString() !== groupId) {
      throw new RepositoryError("Event does not belong to the provided group");
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
  eventId: string;
  userId: string;
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

    if (!group.members.map((m) => m?.toString()).includes(userId.toString())) {
      throw new RepositoryError(
        "User must be a member of the group to attend the event"
      );
    }

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
  const isAttendee = existingEvent.attendees
    .map((a) => a?.toString())
    .includes(userId.toString());
  if (!isAttendee) {
    throw new RepositoryError("User is not an attendee of this event");
  }

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
