import type {
  IEventDTO,
  IPlayingPair,
  ILeagueMeetingData,
  ITrainingData,
  IOtherEventData,
  ITournamentPairsData,
  ITournamentTeamsData,
} from "@/models/event/event-types";
import type {
  EventSchemaType,
  PlayingPairType,
  LeagueMeetingDataType,
  TrainingDataType,
  OtherDataType,
  PlayingPairTypePopulated,
  LeagueMeetingDataTypePopulated,
  TrainingDataTypePopulated,
  EventSchemaTypePopulated,
  TournamentPairsDataType,
  TournamentTeamsDataType,
  TournamentPairsDataTypePopulated,
  TournamentTeamsDataTypePopulated,
} from "@/schemas/model/event/event-types";
import type {
  IEventPopulated,
  ILeagueMeetingDataPopulated,
  IPlayingPairPopulated,
  ITournamentPairsDataPopulated,
  ITournamentTeamsDataPopulated,
  ITrainingDataPopulated,
} from "@/models/mixed-types";
import { EventType } from "@/club-preset/event-type";
import { sanitizeMinUserInfo } from "./user-sanitize";
import { sanitizeGroup } from "./group-sanitize";
import type { UserIdType } from "@/schemas/model/user/user-types";
import { sanitizeFileUrl } from "./common";

function sanitizePlayingPair(pair: IPlayingPair): PlayingPairType {
  return {
    first: pair.first.toString(),
    second: pair.second.toString(),
  };
}

function sanitizeTournamentPairsData(
  data: ITournamentPairsData
): TournamentPairsDataType {
  return {
    type: data.type,
    contestantsPairs: data.contestantsPairs.map(sanitizePlayingPair),
    arbiter: data.arbiter?.toString(),
    tournamentType: data.tournamentType,
  };
}

function sanitizeTournamentTeamsData(
  data: ITournamentTeamsData
): TournamentTeamsDataType {
  return {
    type: data.type,
    arbiter: data.arbiter?.toString(),
    tournamentType: data.tournamentType,
    teams: data.teams.map((t) => ({
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
      event.data?.type === EventType.TOURNAMENT_PAIRS
        ? sanitizeTournamentPairsData(event.data)
        : event.data?.type === EventType.TOURNAMENT_TEAMS
        ? sanitizeTournamentTeamsData(event.data)
        : event.data?.type === EventType.LEAGUE_MEETING
        ? sanitizeLeagueMeetingData(event.data)
        : event.data?.type === EventType.TRAINING
        ? sanitizeTrainingData(event.data)
        : sanitizeOtherEventData(event.data),
    imageUrl: sanitizeFileUrl(event.imageUrl),
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

function sanitizeTournamentPairsDataPopulated(
  d: ITournamentPairsDataPopulated
): TournamentPairsDataTypePopulated {
  return {
    type: d.type,
    contestantsPairs: d.contestantsPairs.map(sanitizePlayingPairPopulated),
    arbiter: d.arbiter ? sanitizeMinUserInfo(d.arbiter) : undefined,
    tournamentType: d.tournamentType,
  };
}

function sanitizeTournamentTeamsDataPopulated(
  d: ITournamentTeamsDataPopulated
): TournamentTeamsDataTypePopulated {
  return {
    type: d.type,
    arbiter: d.arbiter ? sanitizeMinUserInfo(d.arbiter) : undefined,
    tournamentType: d.tournamentType,
    teams: d.teams.map((t) => ({
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
  event: IEventPopulated,
  userId?: UserIdType
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
    imageUrl: sanitizeFileUrl(event.imageUrl),
    data:
      event.data.type === EventType.TOURNAMENT_TEAMS
        ? sanitizeTournamentTeamsDataPopulated(event.data)
        : event.data.type === EventType.TOURNAMENT_PAIRS
        ? sanitizeTournamentPairsDataPopulated(event.data)
        : event.data.type === EventType.LEAGUE_MEETING
        ? sanitizeLeagueMeetingDataPopulated(event.data)
        : event.data.type === EventType.TRAINING
        ? sanitizeTrainingDataPopulated(event.data)
        : sanitizeOtherEventData(event.data),
    isAttending: userId
      ? event.attendees.some((a) => a._id.toString() === userId)
      : undefined,
    isAdmin: userId
      ? event.group.admins.some((a) => a.toString() === userId)
      : undefined,
    isOrganizer: userId ? event.organizer._id.toString() === userId : undefined,
  };
}
