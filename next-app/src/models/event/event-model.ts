/* eslint-disable @typescript-eslint/no-unused-vars */
"server-only";

import mongoose, { Schema } from "mongoose";
import { UserId, UserTableName } from "../user/user-types";
import { GroupId, GroupTableName } from "../group/group-types";
import type {
  IPlayingPair,
  IEventDTO,
  ITournamentPairsData,
  ITournamentTeamsData,
  ILeagueMeetingData,
  ITrainingData,
  IOtherEventData,
} from "./event-types";
import { EventTableName } from "./event-types";
import { EventType, TournamentType } from "@/club-preset/event-type";

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

const PlayingPairSchema = new Schema<IPlayingPair>(
  {
    first: { type: UserId, ref: UserTableName, required: true },
    second: { type: UserId, ref: UserTableName, required: true },
  },
  { _id: false }
);

// Tournament Pairs discriminator
const TournamentPairsDataSchema = baseEventDataSchema.discriminator(
  EventType.TOURNAMENT_PAIRS,
  new Schema<ITournamentPairsData>({
    contestantsPairs: {
      type: [PlayingPairSchema],
      required: true,
      default: [],
    },
    arbiter: { type: UserId, ref: UserTableName, required: false },
    tournamentType: {
      type: String,
      required: false,
      enum: Object.values(TournamentType),
    },
  })
);

// Tournament Teams discriminator
const TournamentTeamsDataSchema = baseEventDataSchema.discriminator(
  EventType.TOURNAMENT_TEAMS,
  new Schema<ITournamentTeamsData>({
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
      required: true,
      default: [],
    },
    arbiter: { type: UserId, ref: UserTableName, required: false },
    tournamentType: {
      type: String,
      required: false,
      enum: Object.values(TournamentType),
    },
  })
);

// League Meeting discriminator
const LeagueMeetingDataSchema = baseEventDataSchema.discriminator(
  EventType.LEAGUE_MEETING,
  new Schema<ILeagueMeetingData>({
    tournamentType: {
      type: String,
      required: false,
      enum: Object.values(TournamentType),
    },
    session: {
      type: [
        {
          contestants: {
            firstPair: PlayingPairSchema,
            secondPair: PlayingPairSchema,
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
  new Schema<ITrainingData>({
    coach: { type: UserId, ref: UserTableName, required: false },
    topic: { type: String, required: true },
  })
);

// Other discriminator
const OtherDataSchema = baseEventDataSchema.discriminator(
  EventType.OTHER,
  new Schema<IOtherEventData>({})
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
