"server-only";

import User from "@/models/user/user-model";
import Group from "@/models/group/group-model";
import mongoose from "mongoose";

import dbConnect from "@/util/connect-mongo";
import { GroupTableName, type IGroupDTO } from "@/models/group/group-types";
import { check, RepositoryError } from "./common";
import type { UserIdType } from "@/schemas/model/user/user-types";
import type { IUserDTO } from "@/models/user/user-types";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type { IUserDTOWithPopulatedGroups } from "@/models/mixed-types";

type UserAndGroupUpdate = {
  userId: UserIdType;
  groupId: GroupIdType;
};

export async function addUserToGroup({
  groupId,
  userId,
  session,
}: UserAndGroupUpdate & {
  session?: mongoose.ClientSession;
}) {
  const execute = async (session: mongoose.ClientSession) => {
    const [updatedGroup, updatedUser] = await Promise.all([
      Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } },
        { new: true, session }
      ).lean<IGroupDTO | null>(),
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { groups: groupId } },
        { new: true, session }
      ).lean<IUserDTO | null>(),
    ]);

    if (!updatedGroup || !updatedUser) {
      throw new RepositoryError("Failed to update user or group");
    }

    return {
      user: updatedUser,
      group: updatedGroup,
    };
  };

  await dbConnect();
  if (session) {
    return execute(session);
  }

  const s = await mongoose.startSession();

  return await s
    .withTransaction(() => execute(s))
    .finally(async () => {
      await s.endSession();
    });
}

export async function addAdminToGroup({ groupId, userId }: UserAndGroupUpdate) {
  await dbConnect();

  const updatedGroup = await Group.findOneAndUpdate(
    {
      _id: groupId,
      members: userId, // user must be a member to be promoted to admin
    },
    {
      $addToSet: { admins: userId }, // add userId to admins if not already present
    },
    { new: true }
  ).lean<IGroupDTO>();

  return check(updatedGroup, "User must be a member to be promoted to admin");
}

export async function getUserWithGroupsData(userId: UserIdType) {
  await dbConnect();
  // populate groups so user.groups contains full group objects instead of ids
  const user = await User.findById(userId)
    .populate<{ groups: IGroupDTO[] }>(GroupTableName)
    .lean<IUserDTOWithPopulatedGroups>();

  const res = check(user, `User not found with id: ${userId} or querry failed`);

  if (res.groups.some((g) => g === null)) {
    throw new RepositoryError(
      "One or more groups referenced by the user were not found"
    );
  }

  return res;
}
