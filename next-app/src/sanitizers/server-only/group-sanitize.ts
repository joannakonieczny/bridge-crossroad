import type { IGroupDTO } from "@/models/group/group-types";

export function sanitizeGroup(group: IGroupDTO) {
  return {
    id: group._id.toString(),
    name: group.name,
    description: group.description,
    imageUrl: group.imageUrl,
    isMain: group.isMain || false,
  };
}
