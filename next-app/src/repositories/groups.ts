"server-only";

import type { IGroup } from "@/models/group/group-types";
import Group from "@/models/group/group-model";
import dbConnect from "@/util/connect-mongo";

export async function findByInviteCode(
  invitationCode: string
): Promise<IGroup | null> {
  await dbConnect();
  let group: IGroup | null = null;
  group = await Group.findOne({ invitationCode: invitationCode });
  if (group) {
    return group;
  }
  return null;
}

export async function addUser(userId: string, groupId: string) {
  await dbConnect();
  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    { $addToSet: { members: userId } },
    { new: true }
  );
  return updatedGroup;
}

export async function getMembers(groupId: string) {
  await dbConnect();
  const group = await Group.findById(groupId);
  if (group) {
    return group.members;
  }
  return null;
}
