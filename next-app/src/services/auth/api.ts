"use server";

import { createSession, deleteSession } from "./server-only/session";
import {
  createNewUser,
  findExisting,
  findUserByEmail,
  changePassword,
} from "@/repositories/user-auth";
import { action } from "@/services/action-lib";
import { loginFormSchema } from "@/schemas/pages/auth/login/login-schema";
import { registerFormSchema } from "@/schemas/pages/auth/register/register-schema";
import { forgotPasswordFormSchema } from "@/schemas/pages/auth/forgot-password/forgot-password-schema";
import { returnValidationErrors } from "next-safe-action";
import { isProbablyEmail } from "@/schemas/common";
import { onRepoError, onDuplicateKey } from "@/repositories/common";
import { sendEmail } from "@/repositories/mailer";
import type { TKey } from "@/lib/typed-translations";
import { newlyCreatedAccountTemplate } from "@/email-templates/pl/email-templates";
import { sendEmail } from "@/repositories/mailer";

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
    try {
      // Znajdź użytkownika po email
      const user = await findUserByEmail(formData.email);

      // Wygeneruj losowe hasło
      const newPassword = generateRandomPassword(12);

      // Zmień hasło użytkownika
      await changePassword(formData.email, newPassword);

      // Wyślij email z nowym hasłem
      const emailBody = `
        <h2>Resetowanie hasła - Bridge Crossroad</h2>
        <p>Twoje nowe tymczasowe hasło to:</p>
        <p style="font-size: 18px; font-weight: bold; color: #2563eb; padding: 10px; background-color: #f3f4f6; border-radius: 4px;">${newPassword}</p>
        <p>Zalecamy zmianę tego hasła po zalogowaniu w ustawieniach konta.</p>
        <p>Jeśli nie prosiłeś o zmianę hasła, skontaktuj się z nami natychmiast.</p>
      `;

      await sendEmail({
        to: formData.email,
        subject: "Resetowanie hasła - Bridge Crossroad",
        body: emailBody,
      });

      return { success: true };
    } catch (error) {
      return onRepoError(error, () =>
        returnValidationErrors(forgotPasswordFormSchema, {
          email: {
            _errors: ["api.auth.resetPassword.userNotFound" satisfies TKey],
          },
        })
      );
    }
  });
