"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./server-only/session";
import { getUserId, UserId } from "./server-only/user-id";
import {
  createNewUser,
  CreateUserParams,
  findExisting,
} from "@/controller/user-auth";

export type LoginFormValues = {
  nicknameOrEmail: string;
  password: string;
  rememberMe: boolean;
};

export async function login(formData: LoginFormValues) {
  const user =
    (await findExisting({
      email: formData.nicknameOrEmail,
      password: formData.password,
    })) ||
    (await findExisting({
      nickname: formData.nicknameOrEmail,
      password: formData.password,
    }));
  if (!user) {
    throw new Error("Invalid credentials");
  }

  await createSession(user._id.toString());
  redirect("/dashboard"); //TODO here?
}

export type RegisterFormValues = CreateUserParams & {
  rememberMe: boolean;
  repeatPassword: string;
};

export async function register(formData: RegisterFormValues) {
  const user = await createNewUser(formData);
  await createSession(user._id.toString());
  redirect("/dashboard"); //TODO here?
}

export async function logout() {
  await deleteSession();
}

export async function requireUserId(): Promise<UserId> {
  const redirectPath = "/auth";
  const userId = await getUserId({
    onUnauthenticated: () => {
      redirect(redirectPath);
    },
  });
  return userId as UserId; //never null, because server redirect will be called if userId is null
}
