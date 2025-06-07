"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./server-only/session";
import testUser from "@/data/test-user.json";
import { getUserId, UserId } from "./server-only/user-id";

export type LoginFormValues = {
  loginOrEmail: string;
  password: string;
  rememberMe: boolean;
};

export async function login(formData: LoginFormValues) {
  if (
    formData.loginOrEmail !== testUser.email ||
    formData.password !== testUser.password
  ) {
    console.warn("User does not exist. Try again.");
    return;
  }
  await createSession(testUser.id);
  redirect("/dashboard"); //TODO
}

export async function logout() {
  await deleteSession();
}

export async function requireUserId(): Promise<UserId> {
  const redirectPath = "/auth/login";
  const userId = await getUserId({
    onUnauthenticated: () => {
      redirect(redirectPath);
    },
  });
  return userId as UserId; //never null, because server redirect will be called if userId is null
}
