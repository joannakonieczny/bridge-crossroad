"use server";

import { createSession, deleteSession } from "./server-only/session";
import { createNewUser, findExisting } from "@/repositories/user-auth";
import { action } from "@/services/action-lib";
import { loginFormSchema } from "@/schemas/pages/auth/login/login-schema";
import { registerFormSchema } from "@/schemas/pages/auth/register/register-schema";
import { returnValidationErrors } from "next-safe-action";
import { isProbablyEmail } from "@/schemas/common";
import { onRepoError } from "@/repositories/common";
import type { TKey } from "@/lib/typed-translations";

export const login = action
  .inputSchema(loginFormSchema)
  .action(async ({ parsedInput: formData }) => {
    const data = isProbablyEmail(formData.nicknameOrEmail)
      ? {
          email: formData.nicknameOrEmail,
          password: formData.password,
        }
      : {
          nickname: formData.nicknameOrEmail,
          password: formData.password,
        };

    const user = await findExisting(data).catch((err) =>
      onRepoError(err, () =>
        returnValidationErrors(loginFormSchema, {
          _errors: ["api.auth.login.invalidCredentials" satisfies TKey],
        })
      )
    );
    await createSession(user._id.toString());
  });

export const register = action
  .inputSchema(registerFormSchema)
  .action(async ({ parsedInput: formData }) => {
    try {
      const user = await createNewUser(formData);
      await createSession(user._id.toString());
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        if (error.message.includes("email")) {
          // email duplicated
          returnValidationErrors(registerFormSchema, {
            email: {
              _errors: ["api.auth.register.emailExists" satisfies TKey],
            },
          });
        } else if (error.message.includes("nickname")) {
          // nickname duplicated
          returnValidationErrors(registerFormSchema, {
            nickname: {
              _errors: ["api.auth.register.nicknameExists" satisfies TKey],
            },
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
