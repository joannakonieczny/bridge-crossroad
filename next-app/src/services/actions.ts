"use server";

import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";

export type FormValues = {
  loginOrEmail: string;
  password: string;
  rememberMe: boolean;
};

const testUser = {
  id: "1",
  email: "contact@cosdensolutions.io",
  password: "12345678",
};


export async function login(formData: FormValues) {
  if (formData.loginOrEmail !== testUser.email || formData.password !== testUser.password) {
    alert("User does not exist. Try again.");
    return;
  }
  await createSession(testUser.id);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/auth/login");
}