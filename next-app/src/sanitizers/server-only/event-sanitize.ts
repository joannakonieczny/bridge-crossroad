import type {
  IEventDTO,
  IPlayingPair,
  ITournamentData,
  ILeagueMeetingData,
  ITrainingData,
  IOtherEventData,
} from "@/models/event/event-types";
import type {
  EventSchemaType,
  PlayingPairType,
  TournamentDataType,
  LeagueMeetingDataType,
  TrainingDataType,
  OtherDataType,
  PlayingPairTypePopulated,
  TournamentDataTypePopulated,
  LeagueMeetingDataTypePopulated,
  TrainingDataTypePopulated,
  EventSchemaTypePopulated,
} from "@/schemas/model/event/event-types";
import type {
  IEventPopulated,
  ILeagueMeetingDataPopulated,
  IPlayingPairPopulated,
  ITournamentDataPopulated,
  ITrainingDataPopulated,
} from "@/models/mixed-types";
import { EventType } from "@/club-preset/event-type";
import { sanitizeMinUserInfo } from "./user-sanitize";
import { sanitizeGroup } from "./group-sanitize";

function sanitizePlayingPair(pair: IPlayingPair): PlayingPairType {
  return {
    first: pair.first.toString(),
    second: pair.second.toString(),
  };
}

function sanitizeTournamentData(data: ITournamentData): TournamentDataType {
  return {
    type: data.type,
    contestantsPairs: data.contestantsPairs.map(sanitizePlayingPair),
    arbiter: data.arbiter?.toString(),
    tournamentType: data.tournamentType,
    teams: (data.teams || []).map((t) => ({
      name: t.name,
      members: t.members.map(toString),
    })),
  };
}

function sanitizeLeagueMeetingData(
  data: ILeagueMeetingData
): LeagueMeetingDataType {
  return {
    type: data.type,
    tournamentType: data.tournamentType,
    session: data.session.map((s) => ({
      id: s._id?.toString(),
      matchNumber: s.matchNumber,
      half: s.half,
      contestants: {
        firstPair: sanitizePlayingPair(s.contestants.firstPair),
        secondPair: sanitizePlayingPair(s.contestants.secondPair),
      },
      opponentTeamName: s.opponentTeamName,
    })),
  };
}

function sanitizeTrainingData(data: ITrainingData): TrainingDataType {
  return {
    type: data.type,
    coach: data.coach?.toString(),
    topic: data.topic,
  };
}

function sanitizeOtherEventData(data: IOtherEventData): OtherDataType {
  return { type: data.type };
}

export function sanitizeEvent(event: IEventDTO): EventSchemaType {
  return {
    id: event._id.toString(),
    title: event.title,
    description: event.description,
    location: event.location,
    organizer: event.organizer.toString(),
    attendees: event.attendees.map((a) => a.toString()),
    group: event.group.toString(),
    duration: event.duration,
    additionalDescription: event.additionalDescription,
    data:
      event.data?.type === EventType.TOURNAMENT
        ? sanitizeTournamentData(event.data)
        : event.data?.type === EventType.LEAGUE_MEETING
        ? sanitizeLeagueMeetingData(event.data)
        : event.data?.type === EventType.TRAINING
        ? sanitizeTrainingData(event.data)
        : sanitizeOtherEventData(event.data),
    imageUrl: event.imageUrl,
  };
}

// Event - populated sanitization

function sanitizePlayingPairPopulated(
  p: IPlayingPairPopulated
): PlayingPairTypePopulated {
  return {
    first: sanitizeMinUserInfo(p.first),
    second: sanitizeMinUserInfo(p.second),
  };
}

function sanitizeTournamentDataPopulated(
  d: ITournamentDataPopulated
): TournamentDataTypePopulated {
  return {
    type: d.type,
    contestantsPairs: d.contestantsPairs.map(sanitizePlayingPairPopulated),
    arbiter: d.arbiter ? sanitizeMinUserInfo(d.arbiter) : undefined,
    tournamentType: d.tournamentType,
    teams: (d.teams || []).map((t) => ({
      name: t.name,
      members: t.members.map(sanitizeMinUserInfo),
    })),
  };
}

function sanitizeLeagueMeetingDataPopulated(
  data: ILeagueMeetingDataPopulated
): LeagueMeetingDataTypePopulated {
  return {
    type: data.type,
    tournamentType: data.tournamentType,
    session: data.session.map((s) => ({
      id: s._id?.toString(),
      matchNumber: s.matchNumber,
      half: s.half,
      contestants: {
        firstPair: sanitizePlayingPairPopulated(s.contestants.firstPair),
        secondPair: sanitizePlayingPairPopulated(s.contestants.secondPair),
      },
      opponentTeamName: s.opponentTeamName,
    })),
  };
}

function sanitizeTrainingDataPopulated(
  data: ITrainingDataPopulated
): TrainingDataTypePopulated {
  return {
    type: data.type,
    coach: data.coach ? sanitizeMinUserInfo(data.coach) : undefined,
    topic: data.topic,
  };
}

export function sanitizeEventPopulated(
  event: IEventPopulated
): EventSchemaTypePopulated {
  return {
    id: event._id.toString(),
    title: event.title,
    description: event.description,
    location: event.location,
    organizer: sanitizeMinUserInfo(event.organizer),
    attendees: event.attendees.map(sanitizeMinUserInfo),
    group: sanitizeGroup(event.group),
    duration: event.duration,
    additionalDescription: event.additionalDescription,
    data:
      event.data.type === EventType.TOURNAMENT
        ? sanitizeTournamentDataPopulated(event.data)
        : event.data.type === EventType.LEAGUE_MEETING
        ? sanitizeLeagueMeetingDataPopulated(event.data)
        : event.data.type === EventType.TRAINING
        ? sanitizeTrainingDataPopulated(event.data)
        : sanitizeOtherEventData(event.data),
  };
}
