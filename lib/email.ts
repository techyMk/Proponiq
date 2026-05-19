import { Resend } from "resend";

let _client: Resend | null = null;

export function getResend(): Resend {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  _client = new Resend(key);
  return _client;
}

export const emailEnabled = Boolean(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Proponiq <onboarding@resend.dev>";

export function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  );
}

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  if (!emailEnabled) {
    console.warn("[email] RESEND_API_KEY missing — email skipped:", { to, subject });
    return { skipped: true as const };
  }
  const resend = getResend();
  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    replyTo,
  });
  if (result.error) {
    console.error("[email] send failed", result.error);
    throw new Error(result.error.message);
  }
  return { skipped: false as const, id: result.data?.id };
}
