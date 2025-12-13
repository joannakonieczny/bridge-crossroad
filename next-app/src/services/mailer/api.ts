"use server";

import { sendEmail } from "@/repositories/mailer";
import { fullAuthAction } from "../action-lib";
import { sendEmailSchema } from "@/schemas/pages/mailer/send-email-schema";

export const sendEmailAction = fullAuthAction
  .inputSchema(sendEmailSchema)
  .action(async ({ parsedInput }) => {
    void sendEmail({
      to: parsedInput.email,
      subject: parsedInput.title,
      body: parsedInput.body,
    }).catch((err) => {
      console.error("Gmail SMTP send failed", err);
    });

    return { success: true };
  });
