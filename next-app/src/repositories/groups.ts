"server-only";

import Group from "@/models/group/group-model";
import dbConnect from "@/util/connect-mongo";
import { check } from "./common";
import type {
  DescriptionType,
  GroupIdType,
  InvitationCodeType,
  NameType,
} from "@/schemas/model/group/group-types";
import type { IGroupDTO } from "@/models/group/group-types";

export async function getAllGroups() {
  await dbConnect();
  const groups = await Group.find().lean<IGroupDTO[]>();
  return check(groups, "Failed to fetch groups");
}

export async function getGroupByInviteCode(invitationCode: InvitationCodeType) {
  await dbConnect();
  const group = await Group.findOne({
    invitationCode: invitationCode,
  }).lean<IGroupDTO>();
  return check(group, "Group not found by invitation code");
}

export async function getById(groupId: GroupIdType) {
  await dbConnect();
  const group = await Group.findById(groupId).lean<IGroupDTO>();
  return check(group, "Group not found");
}

export async function getMainGroup() {
  await dbConnect();
  const group = await Group.findOne({ isMain: true }).lean<IGroupDTO>();
  return check(group, "Main group not found");
}

type CreateGroupData = {
  name: NameType;
  description?: DescriptionType;
  imageUrl?: string;
};

export async function createGroup(data: CreateGroupData, isMain = false) {
  await dbConnect();
  // TODO NON determinictic code generation - to be changed if collisions occur
  const invitationCode = Array.from({ length: 8 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
      Math.floor(Math.random() * 36)
    )
  ).join("");

  const groupData = {
    ...data,
    invitationCode,
    isMain,
  };
  const newGroup = (await new Group(groupData).save()) as IGroupDTO | null;
  return check(newGroup, "Failed to create group");
}

export async function modifyGroup(data: CreateGroupData & { id: GroupIdType }) {
  await dbConnect();

  const update = {
    $set: Object.fromEntries(
      Object.entries({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      }).filter(([, value]) => value !== undefined)
    ),

    $unset: Object.fromEntries(
      Object.entries({
        description: data.description,
        imageUrl: data.imageUrl,
      })
        .filter(([, value]) => value === undefined)
        .map(([key]) => [key, ""])
    ),
  };

  const updatedGroup = await Group.findByIdAndUpdate(data.id, update, {
    new: true,
  }).lean<IGroupDTO>();
  return check(updatedGroup, "Failed to update group");
}
