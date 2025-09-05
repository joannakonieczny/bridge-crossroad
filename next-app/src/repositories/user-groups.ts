"server-only";

import User from "@/models/user/user-model";
import Group from "@/models/group/group-model";
import mongoose from "mongoose";

import dbConnect from "@/util/connect-mongo";
import type { UserIdType } from "@/schemas/model/user/user-types";
import type { IUserDTO } from "@/models/user/user-types";
import type { IGroupDTO, IGroupId } from "@/models/group/group-types";

export type AddUserToGroupResult = {
  user: IUserDTO;
  group: IGroupDTO;
};

export type AddAdminToGroupResult = {
  group: IGroupDTO;
};

export async function addUserToGroup(
  groupId: IGroupId, // TODO use type from validation
  userId: UserIdType
): Promise<AddUserToGroupResult> {
  await dbConnect();

  const session = await mongoose.startSession();

  return await session
    .withTransaction(async () => {
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
        throw new Error("Failed to update user or group");
      }

      return {
        user: updatedUser,
        group: updatedGroup,
      };
    })
    .finally(async () => {
      await session.endSession();
    });
}

export async function addAdminToGroup(groupId: IGroupId, userId: UserIdType) {
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

  if (!updatedGroup) {
    throw new Error("User must be a member to be promoted to admin");
  }

  return updatedGroup;
}
