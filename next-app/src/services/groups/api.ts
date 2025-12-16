"use server";

import {
  addAdminToGroup,
  addUserToGroup,
  getGroupOverview,
  getUserWithGroupsData,
  removeAdminFromGroup,
} from "@/repositories/user-groups";
import {
  executeWithinTransaction,
  onDuplicateKey,
  onRepoError,
} from "@/repositories/common";
import { getUserData } from "@/repositories/onboarding";
import { sendEmail } from "@/repositories/mailer";
import {
  promotedToAdminTemplate,
  demotedFromAdminTemplate,
} from "@/email-templates/pl/email-templates";
import { returnValidationErrors } from "next-safe-action";
import type { TKey } from "@/lib/typed-translations";
import {
  fullAuthAction,
  withinOwnGroupAction,
  withinOwnGroupAsAdminAction,
} from "../action-lib";
import { createModifyGroupFormSchema } from "@/schemas/pages/with-onboarding/groups/groups-schema";
import {
  createGroup,
  getById as getGroupById,
  getGroupByInviteCode,
  modifyGroup,
} from "@/repositories/groups";
import {
  sanitizeGroup,
  sanitizeGroupsFullInfoPopulated,
} from "@/sanitizers/server-only/group-sanitize";
import { havingInvitationCode } from "@/schemas/model/group/group-schema";
import z from "zod";
import { idPropSchema } from "@/schemas/common";

export const getJoinedGroupsInfo = fullAuthAction.action(
  async ({ ctx: { userId } }) => {
    const userDataWithGroupsPopulated = await getUserWithGroupsData(userId);
    const res = userDataWithGroupsPopulated.groups.map(sanitizeGroup);
    return res;
  }
);

export const getJoinedGroupsInfoAsAdmin = fullAuthAction.action(
  async ({ ctx: { userId } }) => {
    const userDataWithGroupsPopulated = await getUserWithGroupsData(userId);
    const res = userDataWithGroupsPopulated.groups
      .filter((g) => g.admins.some((adminId) => adminId.toString() === userId))
      .map(sanitizeGroup);
    return res;
  }
);

export const createNewGroup = fullAuthAction
  .inputSchema(createModifyGroupFormSchema)
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
          returnValidationErrors(createModifyGroupFormSchema, {
            name: { _errors: ["api.groups.create.nameExists" satisfies TKey] },
          })
        )
        .handle();
    });
  });

export const modifyGroupData = withinOwnGroupAsAdminAction
  .inputSchema(async (s) => s.merge(createModifyGroupFormSchema))
  .action(async ({ parsedInput: groupData, ctx: { groupId } }) =>
    modifyGroup({ ...groupData, id: groupId })
      .then((updatedGroup) => sanitizeGroup(updatedGroup))
      .catch((err) => {
        onDuplicateKey(err)
          .on("name", () =>
            returnValidationErrors(createModifyGroupFormSchema, {
              name: {
                _errors: ["api.groups.create.nameExists" satisfies TKey],
              },
            })
          )
          .handle();
      })
  );

export const getGroupData = withinOwnGroupAction.action(
  async ({ ctx: { groupId, userId } }) => {
    const res = await getGroupOverview(groupId);
    return sanitizeGroupsFullInfoPopulated(res, { userId });
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

export const promoteMemberToAdmin = withinOwnGroupAsAdminAction
  .inputSchema(async (s) =>
    s.merge(z.object({ userIdToPromote: idPropSchema }))
  )
  .action(
    async ({ ctx: { groupId }, parsedInput: { userIdToPromote } }) => {
      const updatedGroup = await addAdminToGroup({
        groupId,
        userId: userIdToPromote,
      });
      return sanitizeGroup(updatedGroup);
    },
    {
      onSuccess: async (d) => {
        if (!d.ctx?.groupId || !d.parsedInput.userIdToPromote || !d.ctx.userId)
          return;
        const [promotedUser, promotingUser, group] = await Promise.all([
          getUserData(d.parsedInput.userIdToPromote),
          getUserData(d.ctx.userId),
          getGroupById(d.ctx.groupId),
        ]);

        await sendEmail({
          userEmail: promotedUser.email,
          ...promotedToAdminTemplate({
            groupName: group.name,
            person: {
              firstName: promotedUser.name.firstName,
              nickname: promotedUser.nickname,
            },
            promotedBy: {
              firstName: promotingUser.name.firstName,
              nickname: promotingUser.nickname,
            },
          }),
        });
      },
    }
  );

export const demoteAdminToMember = withinOwnGroupAsAdminAction
  .inputSchema(async (s) => s.merge(z.object({ userIdToDemote: idPropSchema })))
  .action(
    async ({ ctx: { groupId }, parsedInput: { userIdToDemote } }) => {
      const group = await getGroupById(groupId);
      if (group.admins.length <= 1) {
        return returnValidationErrors(z.object({}), {
          _errors: ["api.groups.admin.demote.lastAdminError" satisfies TKey],
        });
      }
      const updatedGroup = await removeAdminFromGroup({
        groupId,
        userId: userIdToDemote,
      });
      return sanitizeGroup(updatedGroup);
    },
    {
      onSuccess: async (d) => {
        if (!d.ctx?.groupId || !d.parsedInput.userIdToDemote || !d.ctx.userId)
          return;
        const [demotedUser, demotingUser, group] = await Promise.all([
          getUserData(d.parsedInput.userIdToDemote),
          getUserData(d.ctx.userId),
          getGroupById(d.ctx.groupId),
        ]);

        await sendEmail({
          userEmail: demotedUser.email,
          ...demotedFromAdminTemplate({
            groupName: group.name,
            person: {
              firstName: demotedUser.name.firstName,
              nickname: demotedUser.nickname,
            },
            demotedBy: {
              firstName: demotingUser.name.firstName,
              nickname: demotingUser.nickname,
            },
          }),
        });
      },
    }
  );
