import type { Overwrite } from "@/lib/types-helpers";
import type { IGroupDTO } from "./group/group-types";
import type { IUserDTO } from "./user/user-types";
import type {
  IEventDTO,
  ILeagueTournamentData,
  IOtherEventData,
  ITournamentData,
  ITrainingData,
} from "./event/event-types";

export type IUserDTOWithPopulatedGroups = Overwrite<
  IUserDTO,
  {
    groups: IGroupDTO[];
  }
>;

export type IGroupDTOWithPopulatedMembersAdmins = Overwrite<
  IGroupDTO,
  {
    members: IUserDTO[];
    admins: IUserDTO[];
  }
>;

// Events populated types

export type IPlayingPairPopulated = {
  first: IUserDTO;
  second: IUserDTO;
};

export type ITournamentDataPopulated = Overwrite<
  ITournamentData,
  {
    contestantsPairs: Array<IPlayingPairPopulated>;
    arbiter?: IUserDTO;
    teams?: Array<{
      name: string;
      members: IUserDTO[];
    }>;
  }
>;

export type ILeagueTournamentDataPopulated = Overwrite<
  ILeagueTournamentData,
  {
    session: Array<
      Overwrite<
        ILeagueTournamentData["session"][number],
        {
          contestants: {
            firstPair: IPlayingPairPopulated;
            secondPair: IPlayingPairPopulated;
          };
        }
      >
    >;
  }
>;

export type ITrainingDataPopulated = Overwrite<
  ITrainingData,
  {
    coach?: IUserDTO;
  }
>;

export type IEventPopulated = Overwrite<
  IEventDTO,
  {
    organizer: IUserDTO;
    attendees: IUserDTO[];
    group: IGroupDTO;
    data:
      | IOtherEventData
      | ITournamentDataPopulated
      | ILeagueTournamentDataPopulated
      | ITrainingDataPopulated;
  }
>;
