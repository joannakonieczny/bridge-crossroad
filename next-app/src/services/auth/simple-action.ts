"use server";

import { ROUTES } from "@/routes";
import { redirect } from "next/navigation";
import { type UserId, getUserId } from "./server-only/user-id";

export async function requireUserId(): Promise<UserId> {
  const redirectPath = ROUTES.auth.login;
  const userId = await getUserId({
    onUnauthenticated: () => {
      redirect(redirectPath);
    },
  });
  return userId as UserId; //never null, because server redirect will be called if userId is null
}
