import type { IGroupDTO } from "@/models/group/group-types";
import type { IGroupDTOWithPopulatedMembersAdmins } from "@/models/mixed-types";
import type {
  GroupBasicType,
  GroupFullType,
} from "@/schemas/model/group/group-types";
import { sanitizeMinUserInfo } from "./user-sanitize";
import { sanitizeFileUrl } from "./common";
import type { UserIdType } from "@/schemas/model/user/user-types";

export function sanitizeGroup(
  group: IGroupDTO | IGroupDTOWithPopulatedMembersAdmins
): GroupBasicType {
  return {
    id: group._id.toString(),
    name: group.name,
    description: group.description,
    imageUrl: sanitizeFileUrl(group.imageUrl),
    isMain: group.isMain || false,
  };
}

type MappersType = {
  userId: UserIdType;
};

export function sanitizeGroupsFullInfoPopulated(
  group: IGroupDTOWithPopulatedMembersAdmins,
  mappers: MappersType
): GroupFullType {
  return {
    ...sanitizeGroup(group),
    invitationCode: group.invitationCode,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    members: group.members.map(sanitizeMinUserInfo),
    admins: group.admins.map(sanitizeMinUserInfo),
    isMember: group.members.some(
      (member) => member._id.toString() === mappers.userId
    ),
    isAdmin: group.admins.some(
      (admin) => admin._id.toString() === mappers.userId
    ),
  };
}
