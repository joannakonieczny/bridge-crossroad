import type { Document } from "mongoose";
import type { IGroupId } from "../group/group-types";
import type { Timestamps } from "../utils";
import { Schema } from "mongoose";

export const UserId = Schema.Types.ObjectId;
export type IUserId = typeof UserId;

export type IUserDTO = Document & {
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

export const UserTableName = "User";
