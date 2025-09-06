"server-only";

import type { IGroupDTO } from "@/models/group/group-types";
import Group from "@/models/group/group-model";
import dbConnect from "@/util/connect-mongo";

export async function getAll() {
  await dbConnect();
  return await Group.find({}).lean<IGroupDTO[]>();
}

export async function getByInviteCode(
  invitationCode: string //TODO change to type from schemas, create schema for group (transfer from page)
) {
  await dbConnect();
  return await Group.findOne({
    invitationCode: invitationCode,
  }).lean<IGroupDTO>();
}

export async function getById(groupId: string) {
  // TODO add type
  await dbConnect();
  return await Group.findById(groupId).lean<IGroupDTO>();
}

type CreateGroupData = {
  name: string;
  description?: string;
  imageUrl?: string;
};

export async function createGroup(data: CreateGroupData) {
  await dbConnect();

  const invitationCode = Math.random().toString(36).substring(2, 10); // generate random 8 char code
  const newGroup = new Group({ ...data, invitationCode });
  return (await newGroup.save()) as IGroupDTO;
}
