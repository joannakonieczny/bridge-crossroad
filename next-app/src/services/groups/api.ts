"use server";

import {
  addAdminToGroup,
  addUserToGroup,
  getUserWithGroupsData,
} from "@/repositories/user-groups";
import { authAction } from "../action-lib";
import { createGroupFormSchema } from "@/schemas/pages/with-onboarding/groups/groups-schema";
import { createGroup } from "@/repositories/groups";
import mongoose from "mongoose";

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

export const createNewGroup = authAction
  .inputSchema(createGroupFormSchema)
  .action(async ({ parsedInput: createGroupData, ctx: { userId } }) => {
    const session = await mongoose.startSession();

    return session
      .withTransaction(async () => {
        const groupCreated = await createGroup(createGroupData);
        await addUserToGroup({
          groupId: groupCreated._id.toString(),
          userId,
          session,
        });
        const group = await addAdminToGroup({
          groupId: groupCreated._id.toString(),
          userId,
        });
        return group;
      })
      .finally(async () => {
        await session.endSession();
      });
  });
