// Minimal, premium-feeling HTML email templates.
// Inline-styled because email clients are a horror show.

const NAVY = "#071B34";
const MINT = "#20D6B5";
const MUTED = "#5C6B82";
const BG = "#F7FAFC";

function appOrigin() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    "https://proponiq-ai.vercel.app"
  );
}

const ICON_URL = `${appOrigin()}/proponiq-icon-dark.png`;

function shell(opts: {
  preheader?: string;
  body: string;
  footer?: string;
}) {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Proponiq</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${NAVY};">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E5EBF4;">
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #EEF2F8;">
              <table role="presentation" width="100%"><tr>
                <td>
                  <img src="${ICON_URL}" width="24" height="24" alt="" style="display:inline-block;vertical-align:middle;border:0;" />
                  <span style="font-weight:700;color:${NAVY};letter-spacing:0.2px;margin-left:10px;font-size:15px;vertical-align:middle;">Proponiq</span>
                </td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">${opts.body}</td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #EEF2F8;color:${MUTED};font-size:12px;line-height:1.5;">
              ${opts.footer ?? "Sent with Proponiq · Smart proposals, bigger wins."}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(label: string, href: string) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;">
  <tr><td style="border-radius:9999px;background:${MINT};">
    <a href="${href}" style="display:inline-block;padding:12px 24px;border-radius:9999px;color:${NAVY};font-weight:600;text-decoration:none;font-size:14px;">${label}</a>
  </td></tr>
</table>`;
}

// -----------------------------------------------------------------------------
// 1) Proposal sent to client
// -----------------------------------------------------------------------------

export function proposalSentEmail(args: {
  senderName: string;
  clientName: string;
  proposalTitle: string;
  message?: string;
  shareUrl: string;
}) {
  const { senderName, clientName, proposalTitle, message, shareUrl } = args;
  const body = `
<p style="margin:0 0 4px;font-size:12px;color:${MUTED};letter-spacing:1.6px;text-transform:uppercase;">New proposal</p>
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:${NAVY};">${escape(senderName)} sent you a proposal</h1>
<p style="margin:0 0 8px;font-size:15px;color:${NAVY};">Hi ${escape(clientName)},</p>
${
  message
    ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${NAVY};white-space:pre-line;">${escape(message)}</p>`
    : `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${NAVY};">${escape(senderName)} has put together a proposal for you. You can review, ask questions, and sign right from your browser — no account needed.</p>`
}
<div style="margin:20px 0;padding:16px 18px;border:1px solid #E5EBF4;border-radius:10px;background:#FAFCFE;">
  <div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:${MUTED};margin-bottom:4px;">Proposal</div>
  <div style="font-size:16px;font-weight:600;color:${NAVY};">${escape(proposalTitle)}</div>
</div>
${button("Open proposal", shareUrl)}
<p style="margin:24px 0 0;font-size:12px;color:${MUTED};">If the button doesn't work, paste this link into your browser:<br><a href="${shareUrl}" style="color:${MINT};">${shareUrl}</a></p>
`;
  return shell({ preheader: `New proposal from ${senderName}`, body });
}

// -----------------------------------------------------------------------------
// 2) Owner — proposal was opened
// -----------------------------------------------------------------------------

export function proposalViewedEmail(args: {
  ownerName: string;
  clientName: string;
  proposalTitle: string;
  proposalUrl: string;
}) {
  const { ownerName, clientName, proposalTitle, proposalUrl } = args;
  const body = `
<p style="margin:0 0 4px;font-size:12px;color:${MUTED};letter-spacing:1.6px;text-transform:uppercase;">View notification</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:${NAVY};">${escape(clientName)} just opened your proposal 👀</h1>
<p style="margin:0 0 16px;font-size:15px;color:${NAVY};">Hi ${escape(ownerName)} — good news. <strong>${escape(clientName)}</strong> opened your proposal &ldquo;${escape(proposalTitle)}&rdquo; for the first time.</p>
<p style="margin:0 0 16px;font-size:14px;color:${MUTED};">This is usually a great moment to follow up with a short, friendly note. Most signatures land within 48 hours of the first open.</p>
${button("View proposal stats", proposalUrl)}
`;
  return shell({ preheader: `${clientName} opened your proposal`, body });
}

// -----------------------------------------------------------------------------
// 3) Owner — proposal was signed
// -----------------------------------------------------------------------------

export function proposalSignedEmail(args: {
  ownerName: string;
  signerName: string;
  signerEmail: string;
  clientName: string;
  proposalTitle: string;
  proposalUrl: string;
  amount: string | null;
}) {
  const { ownerName, signerName, signerEmail, clientName, proposalTitle, proposalUrl, amount } = args;
  const body = `
<p style="margin:0 0 4px;font-size:12px;color:${MUTED};letter-spacing:1.6px;text-transform:uppercase;">Signed</p>
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:${NAVY};">🎉 ${escape(clientName)} signed!</h1>
<p style="margin:0 0 16px;font-size:15px;color:${NAVY};">Hi ${escape(ownerName)}, your proposal &ldquo;${escape(proposalTitle)}&rdquo; was just signed.</p>
<div style="margin:20px 0;padding:18px;border:1px solid ${MINT};border-radius:10px;background:#F2FFFB;">
  <div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:${MUTED};margin-bottom:4px;">Signed by</div>
  <div style="font-size:18px;font-weight:600;color:${NAVY};font-style:italic;">${escape(signerName)}</div>
  <div style="font-size:12px;color:${MUTED};margin-top:4px;">${escape(signerEmail)}</div>
  ${amount ? `<div style="margin-top:12px;padding-top:12px;border-top:1px dashed #BCE9DD;font-size:12px;color:${MUTED};">Investment: <span style="color:${NAVY};font-weight:600;">${escape(amount)}</span></div>` : ""}
</div>
${button("Open in Proponiq", proposalUrl)}
`;
  return shell({ preheader: `${clientName} signed your proposal`, body });
}

// -----------------------------------------------------------------------------
// 4) Signer — confirmation receipt
// -----------------------------------------------------------------------------

export function signatureReceiptEmail(args: {
  signerName: string;
  proposalTitle: string;
  senderName: string;
  shareUrl: string;
  signedAt: Date;
}) {
  const { signerName, proposalTitle, senderName, shareUrl, signedAt } = args;
  const body = `
<p style="margin:0 0 4px;font-size:12px;color:${MUTED};letter-spacing:1.6px;text-transform:uppercase;">Confirmation</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:${NAVY};">Thanks for signing</h1>
<p style="margin:0 0 16px;font-size:15px;color:${NAVY};">Hi ${escape(signerName)} — confirming that you've signed &ldquo;${escape(proposalTitle)}&rdquo; with ${escape(senderName)}.</p>
<div style="margin:20px 0;padding:16px 18px;border:1px solid #E5EBF4;border-radius:10px;background:#FAFCFE;font-size:13px;color:${NAVY};line-height:1.6;">
  <div><strong>Signed at:</strong> ${signedAt.toUTCString()}</div>
</div>
${button("View the proposal", shareUrl)}
<p style="margin:24px 0 0;font-size:12px;color:${MUTED};">Keep this email — it serves as your receipt and audit reference.</p>
`;
  return shell({ preheader: `Confirmation: you signed ${proposalTitle}`, body });
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
