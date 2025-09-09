"use server";

import { ROUTES } from "@/routes";
import { redirect } from "next/navigation";
import { getUserId } from "./server-only/user-id";
import type { UserIdType } from "@/schemas/model/user/user-types";

export async function requireUserId(): Promise<UserIdType> {
  const redirectPath = ROUTES.auth.login;
  const userId = await getUserId({
    onUnauthenticated: () => {
      redirect(redirectPath);
    },
  });
  return userId as UserIdType; //never null, because server redirect will be called if userId is null
}
