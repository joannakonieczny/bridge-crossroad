"server-only";

import { getUserId } from "@/services/auth/server-only/user-id";
import { getUserData } from "@/repositories/onboarding";
import type { UserIdType } from "@/schemas/model/user/user-types";
import type { GroupIdType } from "@/schemas/model/group/group-types";

export function extractUserId() {
  return getUserId({}).catch(() => null);
}

type CheckGroupAccessParams = {
  groupId: GroupIdType | null;
  userId: UserIdType;
};

export async function checkGroupAccess({
  groupId,
  userId,
}: CheckGroupAccessParams) {
  let hasAccess = true;
  if (groupId) {
    //check if user is member of group if groupId provided
    const user = await getUserData(userId);
    hasAccess =
      !!user &&
      !!user.groups &&
      user.groups.some((userGroupId) => groupId === userGroupId.toString());
  }
  return hasAccess;
}

export const MAX_SIZE = 10 * 1024 * 1024; // 10 MB limit

export const ALLOWED_MIME = new Set<string>([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/zip",
]);

export const ALLOWED_EXT = new Set<string>([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "pdf",
  "txt",
  "zip",
]);
