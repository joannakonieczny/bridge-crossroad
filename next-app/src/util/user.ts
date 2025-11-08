import type { PersonWithName } from "@/schemas/model/event/event-types";

export function displayName(val: PersonWithName) {
  return `${val.name?.firstName ?? ""} ${val.name?.lastName ?? ""}`.trim() ?? val.nickname ?? "";
}