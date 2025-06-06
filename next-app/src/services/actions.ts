"use server";

import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";
import testUser from "@/data/test-user.json"

export type FormValues = {
  loginOrEmail: string;
  password: string;
  rememberMe: boolean;
};

export async function login(formData: FormValues) {
  if (formData.loginOrEmail !== testUser.email || formData.password !== testUser.password) {
    console.warn("User does not exist. Try again.");
    return;
  }
  await createSession(testUser.id);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/auth/login");
}