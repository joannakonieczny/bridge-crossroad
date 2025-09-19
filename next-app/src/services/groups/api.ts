"use server";

import {
  addAdminToGroup,
  addUserToGroup,
  getGroupOverview,
  getUserWithGroupsData,
} from "@/repositories/user-groups";
import {
  executeWithinTransaction,
  onDuplicateKey,
} from "@/repositories/common";
import { returnValidationErrors } from "next-safe-action";
import type { TKey } from "@/lib/typed-translations";
import { fullAuthAction, withinOwnGroupAction } from "../action-lib";
import { createGroupFormSchema } from "@/schemas/pages/with-onboarding/groups/groups-schema";
import { createGroup } from "@/repositories/groups";
import {
  sanitizeGroup,
  sanitizeGroupsFullInfoPopulated,
} from "@/sanitizers/server-only/group-sanitize";

export const getJoinedGroupsInfo = fullAuthAction.action(
  async ({ ctx: { userId } }) => {
    const userDataWithGroupsPopulated = await getUserWithGroupsData(userId);
    const res = userDataWithGroupsPopulated.groups.map(sanitizeGroup);
    return res;
  }
);

export const createNewGroup = fullAuthAction
  .inputSchema(createGroupFormSchema)
  .action(async ({ parsedInput: createGroupData, ctx: { userId } }) => {
    return executeWithinTransaction(async (session) => {
      const groupCreated = await createGroup(createGroupData);
      await addUserToGroup({
        groupId: groupCreated._id.toString(),
        userId,
        session,
      });
      const group = await addAdminToGroup({
        groupId: groupCreated._id.toString(),
        userId,
        session,
      });
      return sanitizeGroup(group);
    }).catch((err) => {
      onDuplicateKey(err)
        .on("name", () =>
          returnValidationErrors(createGroupFormSchema, {
            name: { _errors: ["api.groups.create.nameExists" satisfies TKey] },
          })
        )
        .handle();
    });
  });

export const getGroupData = withinOwnGroupAction.action(
  async ({ ctx: { groupId } }) => {
    const res = await getGroupOverview(groupId);
    return sanitizeGroupsFullInfoPopulated(res);
  }
);
