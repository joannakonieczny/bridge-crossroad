"use server";

import { z } from "zod";
import { sendEmail } from "@/repositories/mailer";
import { fullAuthAction } from "../action-lib";

const sendEmailSchema = z.object({
  email: z.string().email(),
  title: z.string().min(1),
  body: z.string().min(1),
});

export const sendEmailAction = fullAuthAction
  .inputSchema(sendEmailSchema)
  .action(async ({ parsedInput }) => {
    void sendEmail({
      to: parsedInput.email,
      subject: parsedInput.title,
      body: parsedInput.body,
    }).catch((err) => {
      console.error("Send email failed", err);
    });

    return { success: true };
  });
