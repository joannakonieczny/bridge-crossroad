"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./server-only/session";
import { getUserId, UserId } from "./server-only/user-id";
import { createNewUser, findExisting } from "@/repositories/user-auth";
import { action } from "@/services/action-lib";
import { LoginFormSchemaProviderServer } from "@/schemas/pages/auth/login/login-schema";
import { RegisterFormSchemaProviderServer } from "@/schemas/pages/auth/register/register-schema";
import { returnValidationErrors } from "next-safe-action";
import { getTranslations } from "next-intl/server";

export const login = action
  .inputSchema((await LoginFormSchemaProviderServer()).loginFormSchema)
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
      const t = await getTranslations("Auth.LoginPage.errors");
      returnValidationErrors(
        (await LoginFormSchemaProviderServer()).loginFormSchema,
        {
          _errors: [t("invalidCredentials")],
        }
      );
    }

    await createSession(user._id.toString());
    redirect("/dashboard"); //auto redirect
  });

export const register = action
  .inputSchema((await RegisterFormSchemaProviderServer()).registerFormSchema)
  .action(async ({ parsedInput: formData }) => {
    try {
      const user = await createNewUser(formData);
      await createSession(user._id.toString());
      redirect("/dashboard"); //auto redirect
    } catch (error) {
      console.error("Registration error:", error);
      const t = await getTranslations("Auth.RegisterPage.errors");
      const schema = (await RegisterFormSchemaProviderServer())
        .registerFormSchema;

      // Obsługa błędu duplikatu MongoDB
      if (error instanceof Error && error.message.includes("duplicate key")) {
        if (error.message.includes("email")) {
          // Błąd duplikatu email
          returnValidationErrors(schema, {
            _errors: [t("emailExists")],
          });
        } else if (error.message.includes("nickname")) {
          // Błąd duplikatu nickname
          returnValidationErrors(schema, {
            _errors: [t("nicknameExists")],
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
  const redirectPath = "/auth";
  const userId = await getUserId({
    onUnauthenticated: () => {
      redirect(redirectPath);
    },
  });
  return userId as UserId; //never null, because server redirect will be called if userId is null
}
