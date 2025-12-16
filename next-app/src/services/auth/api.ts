"use server";

import { createSession, deleteSession } from "./server-only/session";
import { createNewUser, findExisting } from "@/repositories/user-auth";
import { action } from "@/services/action-lib";
import { loginFormSchema } from "@/schemas/pages/auth/login/login-schema";
import { registerFormSchema } from "@/schemas/pages/auth/register/register-schema";
import { returnValidationErrors } from "next-safe-action";
import { isProbablyEmail } from "@/schemas/common";
import { onRepoError, onDuplicateKey } from "@/repositories/common";
import type { TKey } from "@/lib/typed-translations";
import { newlyCreatedAccountTemplate } from "@/email-templates/pl/email-templates";
import { sendEmail } from "@/repositories/mailer";

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

export const register = action.inputSchema(registerFormSchema).action(
  async ({ parsedInput: formData }) => {
    try {
      const user = await createNewUser(formData);
      await createSession(user._id.toString());
    } catch (error) {
      onDuplicateKey(error)
        .on("email", () =>
          returnValidationErrors(registerFormSchema, {
            email: {
              _errors: ["api.auth.register.emailExists" satisfies TKey],
            },
          })
        )
        .on("nickname", () =>
          returnValidationErrors(registerFormSchema, {
            nickname: {
              _errors: ["api.auth.register.nicknameExists" satisfies TKey],
            },
          })
        )
        .handle();
    }
  },
  {
    onSuccess: async (d) => {
      sendEmail({
        userEmail: d.parsedInput.email,
        ...newlyCreatedAccountTemplate({
          person: {
            firstName: d.parsedInput.firstName,
            nickname: d.parsedInput.nickname,
          },
        }),
      });
    },
  }
);

export const logout = action.action(async () => {
  await deleteSession();
  // redirect("/auth"); // guard will handle this
});
