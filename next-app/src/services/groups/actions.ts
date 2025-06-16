"use server";

import { getMembersAsUsers } from "@/controller/user-groups";
import { sanitizeUser } from "@/sanitizers/server-only/user-sanitize";

export async function getSanitizedMembers(groupId: string) {
  const userList = await getMembersAsUsers(groupId);
  return userList.map((user) => sanitizeUser(user));
}
