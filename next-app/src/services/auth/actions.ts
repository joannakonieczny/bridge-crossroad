"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./server-only/session";
//import testUser from "@/data/test-user.json";
import { getUserId, UserId } from "./server-only/userID";
import { connectDB } from "@/services/dbManagement"
import { User, IUserData } from '@/services/user';
 
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


export async function register(formData: Partial<IUserData>) {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: formData.email });
    if (existingUser) {
      return { success: false, error: 'Użytkownik o takim emailu już istnieje' };
    }

    const newUser = new User(formData);
    await newUser.save();

    await createSession(newUser._id.toString());

    return { success: true, userId: newUser._id.toString() };
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return { success: false, error: 'Coś poszło nie tak' };
  }
}

export async function login(formData: LoginFormValues) {
  try {
    await connectDB();

    const query = formData.loginOrEmail.includes('@')
      ? { email: formData.loginOrEmail }
      : { nickname: formData.loginOrEmail };

    const user = await User.findOne(query);

    if (!user) {
      return { success: false, error: 'Nie znaleziono użytkownika' };
    }

    if (user.encodedPassword !== formData.password) {
      return { success: false, error: 'Nieprawidłowe hasło' };
    }

    await createSession(user._id.toString());

    return { success: true };
  } catch (error) {
    console.error('Błąd logowania:', error);
    return { success: false, error: 'Błąd serwera' };
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
