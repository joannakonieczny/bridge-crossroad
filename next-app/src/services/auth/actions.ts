"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./server-only/session";
import type { UserId } from "./server-only/user-id";
import { getUserId } from "./server-only/user-id";
import { createNewUser, findExisting } from "@/repositories/user-auth";
import { ROUTES } from "@/routes";
import { action } from "@/services/action-lib";
import { loginFormSchema } from "@/schemas/pages/auth/login/login-schema";
import { registerFormSchema } from "@/schemas/pages/auth/register/register-schema";
import { returnValidationErrors } from "next-safe-action";
import type { ValidNamespaces } from "@/lib/typed-translations";

export const login = action
  .inputSchema(loginFormSchema)
  .action(async ({ parsedInput: formData }) => {
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
      // throw new Error("Invalid credentials");
      console.log("Invalid credentials", formData);
      returnValidationErrors(loginFormSchema, {
        _errors: [
          "Auth.LoginPage.errors.invalidCredentials" as ValidNamespaces,
        ],
      });
    }

    await createSession(user._id.toString());
    redirect(ROUTES.dashboard); //auto redirect
  });

export const register = action
  .inputSchema(registerFormSchema)
  .action(async ({ parsedInput: formData }) => {
    try {
      const user = await createNewUser(formData);
      await createSession(user._id.toString());
      redirect(ROUTES.dashboard); //auto redirect
    } catch (error) {
      console.error("Registration error:", error);

      // Obsługa błędu duplikatu MongoDB
      if (error instanceof Error && error.message.includes("duplicate key")) {
        if (error.message.includes("email")) {
          // Błąd duplikatu email
          returnValidationErrors(registerFormSchema, {
            _errors: [
              "Auth.RegisterPage.errors.emailExists" as ValidNamespaces,
            ],
          });
        } else if (error.message.includes("nickname")) {
          // Błąd duplikatu nickname
          returnValidationErrors(registerFormSchema, {
            _errors: [
              "Auth.RegisterPage.errors.nicknameExists" as ValidNamespaces,
            ],
          });
        }
      } else {
        // rethrow
        throw error;
      }
    }
  });

export const logout = action.action(async () => {
  await deleteSession();
  // redirect("/auth"); // guard will handle this
});

// TODO: change to safe server-action if needed
export async function requireUserId(): Promise<UserId> {
  const redirectPath = ROUTES.auth.login;
  const userId = await getUserId({
    onUnauthenticated: () => {
      redirect(redirectPath);
    },
  });
  return userId as UserId; //never null, because server redirect will be called if userId is null
}
