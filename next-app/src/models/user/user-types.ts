"server-only";

import { Schema } from "mongoose";
import type { IGroupId } from "../group/group-types";
import type { Timestamps } from "../utils";

export const UserTableName = "User";

export const UserId = Schema.Types.ObjectId;
export type IUserId = typeof UserId;

export type IUserDTO = {
  _id: IUserId;
  email: string;
  encodedPassword: string;
  name: {
    firstName: string;
    lastName: string;
  };
  nickname?: string;
  groups: IGroupId[];
  onboardingData?: {
    academy: string;
    yearOfBirth: number;
    startPlayingDate: Date;
    trainingGroup: string;
    hasRefereeLicense: boolean;
    cezarId?: string;
    bboId?: string;
    cuebidsId?: string;
  };
} & Timestamps;
