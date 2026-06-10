import { resend } from "@/lib/resend";

type SendSignupSuccessEmailParams = {
  to: string;
  handle: string;
};

export async function sendSignupSuccessEmail({
  to,
  handle,
}: SendSignupSuccessEmailParams) {
  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    return { error: "RESEND_FROM_EMAIL is not configured." };
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Welcome to bookmark-app",
    html: `
      <h1>Account created successfully</h1>
      <p>Hi @${handle},</p>
      <p>Your bookmark-app account is ready. You can sign in and start saving your bookmarks.</p>
    `,
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}
