"server-only";

import type { IGroupDTO } from "@/models/group/group-types";
import Group from "@/models/group/group-model";
import dbConnect from "@/util/connect-mongo";
import type {
  DescriptionType,
  GroupIdType,
  ImageUrlType,
  InvitationCodeType,
  NameType,
} from "@/schemas/model/group/group-types";

export async function getAll() {
  await dbConnect();
  return await Group.find({}).lean<IGroupDTO[]>();
}

export async function getByInviteCode(
  invitationCode: InvitationCodeType //TODO change to type from schemas, create schema for group (transfer from page)
) {
  await dbConnect();
  return await Group.findOne({
    invitationCode: invitationCode,
  }).lean<IGroupDTO>();
}

export async function getById(groupId: GroupIdType) {
  await dbConnect();
  return await Group.findById(groupId).lean<IGroupDTO>();
}

export async function getMainGroup() {
  await dbConnect();
  return await Group.findOne({ isMain: true }).lean<IGroupDTO>();
}

type CreateGroupData = {
  name: NameType;
  description?: DescriptionType;
  imageUrl?: ImageUrlType;
};

export async function createGroup(data: CreateGroupData, isMain = false) {
  await dbConnect();
  // TODO NON determinictic code generation - to be changed if collisions occur
  const invitationCode = Array.from({ length: 8 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
      Math.floor(Math.random() * 36)
    )
  ).join("");
  const newGroup = new Group({ ...data, invitationCode, isMain });
  return (await newGroup.save()) as IGroupDTO;
}
