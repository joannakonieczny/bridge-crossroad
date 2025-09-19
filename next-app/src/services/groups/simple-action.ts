import { getUserData } from "@/repositories/onboarding";
import { ROUTES } from "@/routes";
import { redirect } from "next/navigation";
import { requireUserId } from "../auth/simple-action";
import type { UserIdType } from "@/schemas/model/user/user-types";
import type { GroupIdType } from "@/schemas/model/group/group-types";

type RequireGroupAccessParams = {
  groupId: GroupIdType;
  userId?: UserIdType;
};

export async function requireGroupAccess({
  groupId,
  userId,
}: RequireGroupAccessParams) {
  userId = userId || (await requireUserId());
  const user = await getUserData(userId);

  const hasAccess =
    !!user &&
    !!user.groups &&
    user.groups.some((userGroupId) => {
      return groupId === userGroupId.toString();
    });

  if (!hasAccess) {
    redirect(ROUTES.groups);
  }

  return true;
}
