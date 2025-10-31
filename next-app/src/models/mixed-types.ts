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

type ITournamentDataPopulated = Overwrite<
  ITournamentData,
  {
    contestantsPairs: Array<{
      first: IUserDTO;
      second: IUserDTO;
    }>;
    arbiter?: IUserDTO;
    teams?: Array<{
      name: string;
      members: IUserDTO[];
    }>;
  }
>;

type ILeagueTournamentDataPopulated = Overwrite<
  ILeagueTournamentData,
  {
    session: Array<
      Overwrite<
        ILeagueTournamentData["session"][number],
        {
          contestants: {
            firstPair: { first: IUserDTO; second: IUserDTO };
            secondPair: { first: IUserDTO; second: IUserDTO };
          };
        }
      >
    >;
  }
>;

type ITrainingDataPopulated = Overwrite<
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
