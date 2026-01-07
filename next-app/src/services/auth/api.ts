"use server";

import { createSession, deleteSession } from "./server-only/session";
import {
  createNewUser,
  findExisting,
  findUserByEmail,
  changePasswordToTemporary,
} from "@/repositories/user-auth";
import { action } from "@/services/action-lib";
import { loginFormSchema } from "@/schemas/pages/auth/login/login-schema";
import { registerFormSchema } from "@/schemas/pages/auth/register/register-schema";
import { forgotPasswordFormSchema } from "@/schemas/pages/auth/forgot-password/forgot-password-schema";
import { returnValidationErrors } from "next-safe-action";
import { isProbablyEmail } from "@/schemas/common";
import {
  onRepoError,
  onDuplicateKey,
  executeWithinTransaction,
} from "@/repositories/common";
import { sendEmail } from "@/repositories/mailer";
import type { TKey } from "@/lib/typed-translations";
import {
  newlyCreatedAccountTemplate,
  forgetPasswordTemplate,
} from "@/email-templates/pl/email-templates";

function generateRandomPassword(length: number = 12): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*";
  const allChars = uppercase + lowercase + numbers + special;

  let password = "";
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

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

export const resetPassword = action
  .inputSchema(forgotPasswordFormSchema)
  .action(async ({ parsedInput: formData }) => {
    const user = await findUserByEmail(formData.email).catch((error) =>
      onRepoError(error, () =>
        returnValidationErrors(forgotPasswordFormSchema, {
          email: {
            _errors: ["api.auth.resetPassword.userNotFound" satisfies TKey],
          },
        })
      )
    );
    const newPassword = generateRandomPassword(12);

    return executeWithinTransaction(async (session) => {
      await changePasswordToTemporary({
        userId: user._id.toString(),
        newPassword,
        session,
      });
      await sendEmail({
        userEmail: formData.email,
        ...forgetPasswordTemplate({
          temporaryPassword: newPassword,
          person: {
            firstName: user.name.firstName,
            nickname: user.nickname,
          },
        }),
      });
    });
  });
