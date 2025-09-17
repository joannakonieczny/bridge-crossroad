"use server";

import { getUserWithGroupsData } from "@/repositories/user-groups";
import { authAction } from "../action-lib";

export const getJoinedGroupsInfo = authAction.action(
  async ({ ctx: { userId } }) => {
    const userDataWithGroupsPopulated = await getUserWithGroupsData(userId);
    const res = userDataWithGroupsPopulated.groups.map((group) => ({
      id: group._id.toString(),
      name: group.name,
      description: group.description,
      imageUrl: group.imageUrl,
      isMain: group.isMain || false,
    }));
    return res;
  }
);

// export const createGroup = authAction
//   .inputSchema()
//   .action(async ({ parsedInput: createGroupData, ctx: { userId } }) => {});
