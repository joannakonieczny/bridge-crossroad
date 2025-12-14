"server-only";

import User from "@/models/user/user-model";
import Group from "@/models/group/group-model";

import dbConnect from "@/util/connect-mongo";
import { GroupTableName, type IGroupDTO } from "@/models/group/group-types";
import { check, executeWithinTransaction, checkTrue } from "./common";
import type { WithSession } from "./common";
import type { UserIdType } from "@/schemas/model/user/user-types";
import { UserTableName, type IUserDTO } from "@/models/user/user-types";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import type {
  IGroupDTOWithPopulatedMembersAdmins,
  IUserDTOWithPopulatedGroups,
} from "@/models/mixed-types";

type UserAndGroupUpdate = {
  userId: UserIdType;
  groupId: GroupIdType;
};

export async function addUserToGroup({
  groupId,
  userId,
  session,
}: UserAndGroupUpdate & WithSession) {
  await dbConnect();

  return executeWithinTransaction(async (s) => {
    const [updatedGroup, updatedUser] = await Promise.all([
      Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } },
        { new: true, session: s }
      ).lean<IGroupDTO>(),
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { groups: groupId } },
        { new: true, session: s }
      ).lean<IUserDTO>(),
    ]);
    const user = check(updatedUser, "Failed to add group to user");
    const group = check(updatedGroup, "Failed to add user to group");
    return { user, group };
  }, session);
}

export async function addAdminToGroup({
  groupId,
  userId,
  session,
}: UserAndGroupUpdate & WithSession) {
  await dbConnect();

  return executeWithinTransaction(async (s) => {
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        members: userId, // user must be a member to be promoted to admin
      },
      {
        $addToSet: { admins: userId },
      },
      { new: true, session: s }
    ).lean<IGroupDTO>();

    return check(updatedGroup, "User must be a member to be promoted to admin");
  }, session);
}

export async function removeAdminFromGroup({
  groupId,
  userId,
}: UserAndGroupUpdate) {
  await dbConnect();
  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    {
      $pull: { admins: userId },
    },
    { new: true }
  ).lean<IGroupDTO>();
  return check(updatedGroup, "Failed to remove admin from group");
}

export async function getUserWithGroupsData(userId: UserIdType) {
  await dbConnect();
  // populate groups so user.groups contains full group objects instead of ids
  const user = await User.findById(userId)
    .populate<{ groups: IGroupDTO[] }>({
      path: "groups",
      model: GroupTableName,
    })
    .lean<IUserDTOWithPopulatedGroups>();

  const res = check(user, `User not found with id: ${userId} or querry failed`);
  checkTrue(
    res.groups.every((g) => g !== null),
    "One or more groups referenced by the user were not found"
  );

  return res;
}

export async function getGroupOverview(groupId: GroupIdType) {
  await dbConnect();

  const group = await Group.findById(groupId)
    .populate<{ members: IUserDTO[]; admins: IUserDTO[] }>([
      { path: "members", model: UserTableName },
      { path: "admins", model: UserTableName },
    ])
    .lean<IGroupDTOWithPopulatedMembersAdmins>();

  const res = check(
    group,
    `Group not found with id: ${groupId} or query failed`
  );

  checkTrue(
    res.members.every((u) => u !== null),
    "One or more members referenced by the group were not found"
  );
  checkTrue(
    res.admins.every((u) => u !== null),
    "One or more admins referenced by the group were not found"
  );

  return res;
}
