"server-only";

import { Schema } from "mongoose";
import type { Timestamps } from "../utils";
import type { UserId } from "../user/user-types";
import type { GroupId } from "../group/group-types";
import type { EventType, TournamentType, Half } from "@/club-preset/event-type";

export const EventTableName = "Event";

export const EventId = Schema.Types.ObjectId;

type PlayingPair = {
  first: typeof UserId;
  second: typeof UserId;
};

type TournamentData = {
  type: EventType.TOURNAMENT;
  contestantsPairs: Array<PlayingPair>;
  arbiter: typeof UserId;
  tournamentType?: TournamentType;
  teams?: Array<{
    name: string;
    members: (typeof UserId)[];
  }>;
};

type LeagueTournamentData = {
  type: EventType.LEAGUE_MEETING;
  tournamentType?: TournamentType;
  session: Array<{
    _id?: typeof EventId;
    matchNumber: number;
    half: Half;
    contestants: {
      firstPair: PlayingPair;
      secondPair: PlayingPair;
    };
    opponentTeamName?: string;
  }>;
};

type TrainingData = {
  type: EventType.TRAINING;
  coach: typeof UserId;
  topic: string;
};

type OtherEventData = {
  type: EventType.OTHER;
};

export type IEventDTO = {
  _id: typeof EventId;
  title: string;
  description?: string;
  duration: {
    startsAt: Date;
    endsAt: Date;
  };
  additionalDescription?: string;
  location?: string;
  organizer: typeof UserId;
  attendees: (typeof UserId)[];
  group: typeof GroupId;
  imageUrl?: string;
  data: TournamentData | LeagueTournamentData | TrainingData | OtherEventData;
} & Timestamps;
