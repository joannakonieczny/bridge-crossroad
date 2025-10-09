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
  onRepoError,
} from "@/repositories/common";
import { returnValidationErrors } from "next-safe-action";
import type { TKey } from "@/lib/typed-translations";
import { fullAuthAction, getWithinOwnGroupAction } from "../action-lib";
import { createGroupFormSchema } from "@/schemas/pages/with-onboarding/groups/groups-schema";
import { createGroup, getGroupByInviteCode } from "@/repositories/groups";
import {
  sanitizeGroup,
  sanitizeGroupsFullInfoPopulated,
} from "@/sanitizers/server-only/group-sanitize";
import { havingInvitationCode } from "@/schemas/model/group/group-schema";
import z from "zod";

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

export const getGroupData = getWithinOwnGroupAction(z.object({})).action(
  async ({ ctx: { groupId } }) => {
    const res = await getGroupOverview(groupId);
    return sanitizeGroupsFullInfoPopulated(res);
  }
);

export const addUserToGroupByInvitationCode = fullAuthAction
  .inputSchema(havingInvitationCode)
  .action(async ({ parsedInput: { invitationCode }, ctx: { userId } }) => {
    const group = await getGroupByInviteCode(invitationCode).catch((err) =>
      onRepoError(err, () =>
        returnValidationErrors(havingInvitationCode, {
          _errors: ["api.groups.join.invalidInvitationCode" satisfies TKey],
        })
      )
    );
    if (group.members.some((m) => m.toString() === userId)) {
      returnValidationErrors(havingInvitationCode, {
        _errors: ["api.groups.join.alreadyMember" satisfies TKey],
      });
    }
    await addUserToGroup({
      groupId: group._id.toString(),
      userId,
    });
    return true;
  });
