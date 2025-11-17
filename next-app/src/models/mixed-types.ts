"sever-only";

import type { IChatMessageDTO } from "./chat-message/chat-message-types";
import type { Overwrite } from "@/lib/types-helpers";
import type { IGroupDTO } from "./group/group-types";
import type { IUserDTO } from "./user/user-types";
import type {
  IEventDTO,
  ILeagueMeetingData,
  IOtherEventData,
  ITournamentPairsData,
  ITournamentTeamsData,
  ITrainingData,
} from "./event/event-types";
import type {
  IPartnershipPostDTO,
  IPeriodPartnershipPostData,
  ISinglePartnershipPostData,
} from "./partnership-post/partnership-post-types";

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

export type IChatMessageDTOWithPopulatedSender = Overwrite<
  IChatMessageDTO,
  {
    senderId: IUserDTO;
  }
>;

export type ITournamentPairsDataPopulated = Overwrite<
  ITournamentPairsData,
  {
    contestantsPairs: Array<IPlayingPairPopulated>;
    arbiter?: IUserDTO;
  }
>;

export type ITournamentTeamsDataPopulated = Overwrite<
  ITournamentTeamsData,
  {
    arbiter?: IUserDTO;
    teams: Array<{
      name: string;
      members: IUserDTO[];
    }>;
  }
>;

export type ILeagueMeetingDataPopulated = Overwrite<
  ILeagueMeetingData,
  {
    session: Array<
      Overwrite<
        ILeagueMeetingData["session"][number],
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
      | ITournamentPairsDataPopulated
      | ITournamentTeamsDataPopulated
      | ILeagueMeetingDataPopulated
      | ITrainingDataPopulated;
  }
>;

export type IPartnershipPostPopulated = Overwrite<
  IPartnershipPostDTO,
  {
    ownerId: IUserDTO;
    groupId: IGroupDTO;
    interestedUsersIds: IUserDTO[];
    data:
      | IPeriodPartnershipPostData
      | Overwrite<
          ISinglePartnershipPostData,
          {
            eventId: IEventDTO;
          }
        >;
  }
>;
