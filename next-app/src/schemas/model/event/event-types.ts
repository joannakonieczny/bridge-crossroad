import type { z } from "zod";
import type * as s from "./event-schema";
import type { UserTypeBasic } from "../user/user-types";
import type { Overwrite } from "@/lib/types-helpers";
import type { GroupBasicType } from "../group/group-types";

export type TitleType = z.infer<typeof s.titleSchema>;
export type DescriptionType = z.infer<typeof s.descriptionSchema>;
export type LocationType = z.infer<typeof s.locationSchema>;
export type ImageUrlType = z.infer<typeof s.imageUrlSchema>;
export type DurationType = z.infer<typeof s.durationSchema>;

export type PlayingPairType = z.infer<typeof s.playingPairSchema>;
export type TournamentPairsDataType = z.infer<
  typeof s.tournamentPairsDataSchema
>;
export type TournamentTeamsDataType = z.infer<
  typeof s.tournamentTeamsDataSchema
>;
export type LeagueMeetingDataType = z.infer<typeof s.leagueMeetingDataSchema>;
export type TrainingDataType = z.infer<typeof s.trainingDataSchema>;
export type OtherDataType = z.infer<typeof s.otherDataSchema>;

export type EventDataType = z.infer<typeof s.dataSchema>;
export type EventSchemaType = z.infer<typeof s.eventSchema>;

export type EventIdType = string;

export type PlayingPairTypePopulated = {
  first: UserTypeBasic;
  second: UserTypeBasic;
};

export type TournamentPairsDataTypePopulated = Overwrite<
  TournamentPairsDataType,
  {
    contestantsPairs: PlayingPairTypePopulated[];
    arbiter?: UserTypeBasic;
  }
>;

export type TournamentTeamsDataTypePopulated = Overwrite<
  TournamentTeamsDataType,
  {
    teams: Array<{ name: string; members: UserTypeBasic[] }>;
    arbiter?: UserTypeBasic;
  }
>;

export type LeagueMeetingDataTypePopulated = Overwrite<
  LeagueMeetingDataType,
  {
    session: Array<
      Overwrite<
        LeagueMeetingDataType["session"][number],
        {
          contestants: {
            firstPair: PlayingPairTypePopulated;
            secondPair: PlayingPairTypePopulated;
          };
        }
      >
    >;
  }
>;

export type TrainingDataTypePopulated = Overwrite<
  TrainingDataType,
  {
    coach?: UserTypeBasic;
  }
>;

export type EventDataTypePopulated =
  | TournamentPairsDataTypePopulated
  | TournamentTeamsDataTypePopulated
  | LeagueMeetingDataTypePopulated
  | TrainingDataTypePopulated
  | OtherDataType;

export type EventSchemaTypePopulated = Overwrite<
  EventSchemaType,
  {
    data: EventDataTypePopulated;
    organizer: UserTypeBasic;
    attendees: UserTypeBasic[];
    group: GroupBasicType;
  }
>;
