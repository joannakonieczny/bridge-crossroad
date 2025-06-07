"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./server-only/session";
//import testUser from "@/data/test-user.json";
import { getUserId, UserId } from "./server-only/userID";
import { connectDB } from "@/services/dbManagement"
 
export type LoginFormValues = {
  loginOrEmail: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterFormValues = {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
  rememberMe: boolean;
};

export async function login(formData: LoginFormValues) {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('v1');

    const user = await usersCollection.findOne({
      $or: [
        { email: formData.loginOrEmail },
        { login: formData.loginOrEmail }
      ]
    });

    if (!user) {
      return { success: false, error: 'Nieprawidłowy login lub hasło' };
    }

    if (user.password !== formData.password) {
      return { success: false, error: 'Nieprawidłowy login lub hasło' };
    }

    await createSession(user._id.toString());

    return { success: true };
  } catch (error) {
    console.error('Błąd logowania:', error);
    return { success: false, error: 'Coś poszło nie tak' };
  }
}

export async function register(formData: RegisterFormValues) {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('v1');

    const existingUser = await usersCollection.findOne({ email: formData.email });
    if (existingUser) {
      console.warn('Użytkownik już istnieje');
      return { success: false, error: 'Nieprawidłowe dane' };
    }

    const { repeatPassword, rememberMe, ...userData } = formData;
    const insertResult = await usersCollection.insertOne(userData);

    await createSession(insertResult.insertedId.toString());
    return { success: true };
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return { success: false, error: 'Nieprawidłowe dane' };
  }
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
