export type SendEmailInput = {
  to: string
  subject: string
  body: string
}

export const sendEmail = async ({
  to,
  subject,
  body,
}: SendEmailInput): Promise<void> => {
  // 🔌 tutaj wpinasz realnego providera
  // np. Resend / SES / SendGrid / SMTP

  await mailProvider.send({
    to,
    subject,
    html: body,
  })
}
