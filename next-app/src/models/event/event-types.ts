"server-only";

import { Schema } from "mongoose";
import type { Timestamps } from "../utils";
import type { UserId } from "../user/user-types";
import type { GroupId } from "../group/group-types";
import type { EventType, TournamentType, Half } from "@/club-preset/event-type";

export const EventTableName = "Event";

export const EventId = Schema.Types.ObjectId;

export type IPlayingPair = {
  first: typeof UserId;
  second: typeof UserId;
};

export type ITournamentData = {
  type: EventType.TOURNAMENT;
  contestantsPairs: Array<IPlayingPair>;
  arbiter?: typeof UserId;
  tournamentType?: TournamentType;
  teams?: Array<{
    name: string;
    members: (typeof UserId)[];
  }>;
};

export type ILeagueMeetingData = {
  type: EventType.LEAGUE_MEETING;
  tournamentType?: TournamentType;
  session: Array<{
    _id?: typeof EventId;
    matchNumber: number;
    half: Half;
    contestants: {
      firstPair: IPlayingPair;
      secondPair: IPlayingPair;
    };
    opponentTeamName?: string;
  }>;
};

export type ITrainingData = {
  type: EventType.TRAINING;
  coach?: typeof UserId;
  topic: string;
};

export type IOtherEventData = {
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
  data: ITournamentData | ILeagueMeetingData | ITrainingData | IOtherEventData;
} & Timestamps;
