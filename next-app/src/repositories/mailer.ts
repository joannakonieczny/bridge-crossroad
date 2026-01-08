import nodemailer from "nodemailer";
import { config } from "../util/envConfigLoader";

const transporter = nodemailer.createTransport({
  host: config.GMAIL_SMTP_HOST,
  port: config.GMAIL_SMTP_PORT,
  secure: false, // STARTTLS
  auth: {
    user: config.GMAIL_SMTP_USER,
    pass: config.GMAIL_SMTP_PASSWORD,
  },
});

type SendEmailInput = {
  userEmail: string;
  subject: string;
  body: string;
};

export const sendEmail = async ({ userEmail, subject, body }: SendEmailInput) =>
  transporter.sendMail({
    from: config.GMAIL_FROM_EMAIL,
    to: userEmail,
    subject,
    html: body,
  });
