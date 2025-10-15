import type { IGroupDTO } from "@/models/group/group-types";
import type { IGroupDTOWithPopulatedMembersAdmins } from "@/models/mixed-types";
import { sanitizeMinUserInfo } from "./user-sanitize";

export function sanitizeGroup(
  group: IGroupDTO | IGroupDTOWithPopulatedMembersAdmins
) {
  return {
    _id: group._id.toString(),
    name: group.name,
    description: group.description,
    imageUrl: group.imageUrl,
    isMain: group.isMain || false,
  };
}

export function sanitizeGroupsFullInfoPopulated(
  group: IGroupDTOWithPopulatedMembersAdmins
) {
  return {
    ...sanitizeGroup(group),
    invitationCode: group.invitationCode,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    members: group.members.map(sanitizeMinUserInfo),
    admins: group.admins.map(sanitizeMinUserInfo),
  };
}
