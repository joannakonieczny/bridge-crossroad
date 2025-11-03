/* eslint-disable @typescript-eslint/no-unused-vars */
"server-only";

import mongoose, { Schema } from "mongoose";
import { UserId, UserTableName } from "../user/user-types";
import { GroupId, GroupTableName } from "../group/group-types";
import { EventTableName, type IEventDTO } from "./event-types";
import { EventType, TournamentType, Half } from "@/club-preset/event-type";

// Base sub-schema for event data with discriminator
const baseEventDataSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(EventType),
    },
  },
  { discriminatorKey: "type", _id: false }
);

// Tournament discriminator
const TournamentDataSchema = baseEventDataSchema.discriminator(
  EventType.TOURNAMENT,
  new Schema({
    contestantsPairs: {
      type: [
        {
          first: { type: UserId, ref: UserTableName, required: true },
          second: { type: UserId, ref: UserTableName, required: true },
        },
      ],
      required: true,
    },
    arbiter: { type: UserId, ref: UserTableName, required: false },
    tournamentType: {
      type: String,
      required: false,
      enum: Object.values(TournamentType),
    },
    teams: {
      type: [
        {
          name: { type: String, required: true },
          members: {
            type: [{ type: UserId, ref: UserTableName }],
            required: true,
          },
        },
      ],
      required: false,
    },
  })
);

// League Meeting discriminator
const LeagueMeetingDataSchema = baseEventDataSchema.discriminator(
  EventType.LEAGUE_MEETING,
  new Schema({
    tournamentType: {
      type: String,
      required: false,
      enum: Object.values(TournamentType),
    },
    session: {
      type: [
        {
          matchNumber: { type: Number, required: true },
          half: { type: String, enum: Object.values(Half), required: true },
          contestants: {
            firstPair: {
              first: { type: UserId, ref: UserTableName, required: true },
              second: { type: UserId, ref: UserTableName, required: true },
            },
            secondPair: {
              first: { type: UserId, ref: UserTableName, required: true },
              second: { type: UserId, ref: UserTableName, required: true },
            },
          },
          opponentTeamName: { type: String, required: false },
        },
      ],
      required: true,
    },
  })
);

// Training discriminator
const TrainingDataSchema = baseEventDataSchema.discriminator(
  EventType.TRAINING,
  new Schema({
    coach: { type: UserId, ref: UserTableName, required: false },
    topic: { type: String, required: true },
  })
);

// Other discriminator
const OtherDataSchema = baseEventDataSchema.discriminator(
  EventType.OTHER,
  new Schema({})
);

const Event = new Schema<IEventDTO>(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: false },
    location: { type: String, required: false },
    organizer: { type: UserId, ref: UserTableName, required: true },
    attendees: { type: [{ type: UserId, ref: UserTableName }], default: [] },
    group: { type: GroupId, ref: GroupTableName, required: true, index: true },
    duration: {
      startsAt: { type: Date, required: true },
      endsAt: { type: Date, required: true },
    },
    additionalDescription: { type: String, required: false },
    data: baseEventDataSchema,
    imageUrl: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEventDTO>(EventTableName, Event);
