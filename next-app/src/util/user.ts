import type { UserTypeBasic } from "@/schemas/model/user/user-types";

export function displayName(val: UserTypeBasic) {
  return `${val.name?.firstName ?? ""} ${val.name?.lastName ?? ""}`.trim() ?? val.nickname ?? "";
}