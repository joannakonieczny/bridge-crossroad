import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_SMTP_HOST!,
  port: Number(process.env.GMAIL_SMTP_PORT!),
  secure: false, // STARTTLS
  auth: {
    user: process.env.GMAIL_SMTP_USER!,
    pass: process.env.GMAIL_SMTP_PASSWORD!,
  },
});

type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};

export const sendEmail = async ({
  to,
  subject,
  body,
}: SendEmailInput): Promise<void> => {
  await transporter.sendMail({
    from: process.env.GMAIL_FROM_EMAIL!,
    to,
    subject,
    html: body,
  });
};
