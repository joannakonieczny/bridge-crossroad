"server-only";

import { Schema } from "mongoose";
import type { GroupId } from "../group/group-types";
import type { Timestamps } from "../utils";

export const UserTableName = "User";

export const UserId = Schema.Types.ObjectId;

export type IUserDTO = {
  _id: typeof UserId;
  email: string;
  encodedPassword: string;
  name: {
    firstName: string;
    lastName: string;
  };
  nickname?: string;
  groups: (typeof GroupId)[];
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
