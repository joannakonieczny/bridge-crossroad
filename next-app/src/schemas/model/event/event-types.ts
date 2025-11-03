import type { z } from "zod";
import type * as s from "./event-schema";

export type TitleType = z.infer<typeof s.titleSchema>;
export type DescriptionType = z.infer<typeof s.descriptionSchema>;
export type LocationType = z.infer<typeof s.locationSchema>;
export type ImageUrlType = z.infer<typeof s.imageUrlSchema>;
export type DurationType = z.infer<typeof s.durationSchema>;

export type PlayingPairType = z.infer<typeof s.playingPairSchema>;
export type TournamentDataType = z.infer<typeof s.tournamentDataSchema>;
export type LeagueMeetingDataType = z.infer<typeof s.leagueMeetingDataSchema>;
export type TrainingDataType = z.infer<typeof s.trainingDataSchema>;
export type OtherDataType = z.infer<typeof s.otherDataSchema>;

export type EventDataType = z.infer<typeof s.dataSchema>;
export type EventSchemaType = z.infer<typeof s.eventSchema>;

export type EventIdType = string;

// delete that:

enum EventType {
  TOURNAMENT = "TOURNAMENT",
  LEAGUE_MEETING = "LEAGUE_MEETING",
  TRAINING = "TRAINING",
  OTHER = "OTHER",
}

type EventDataType2 = {
    type: EventType.TOURNAMENT; ///////////////
    // contestantsPairs: {
    //     first: string;
    //     second: string;
    // }[];
    arbiter?: string | undefined;
    tournamentType?: TournamentType | undefined;
    // teams?: {
    //     name: string;
    //     members: string[];
    // }[] | undefined;
} | {
    type: EventType.LEAGUE_MEETING; /////////////
    session: {
        matchNumber: number;
        half: Half;
        contestants: {
            firstPair: {
                first: string;
                second: string;
            };
            secondPair: {
                first: string;
                second: string;
            };
        };
        opponentTeamName?: string | undefined;
    }[];
    tournamentType?: TournamentType | undefined;
} | {
    type: EventType.TRAINING;
    topic: string;
    coach?: string | undefined;
} | {
    ...;
}