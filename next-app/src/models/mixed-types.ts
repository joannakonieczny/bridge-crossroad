import type { IGroupDTO } from "./group/group-types";
import type { IUserDTO } from "./user/user-types";

export type IUserDTOWithPopulatedGroups = Omit<IUserDTO, "groups"> & {
  groups: IGroupDTO[];
};
