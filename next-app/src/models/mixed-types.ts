import type { IGroupDTO } from "./group/group-types";
import type { IUserDTO } from "./user/user-types";

export type IUserDTOWithPopulatedGroups = Omit<IUserDTO, "groups"> & {
  groups: IGroupDTO[];
};

export type IGroupDTOWithPopulatedMembersAdmins = Omit<
  IGroupDTO,
  "members" | "admins"
> & {
  members: IUserDTO[];
  admins: IUserDTO[];
};

export type IChatMessageDTOWithPopulatedSender = Omit<IUserDTO, "senderId"> & {
  senderId: IUserDTO;
};
