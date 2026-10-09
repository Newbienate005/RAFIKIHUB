/**
 * Transactional email through Resend's HTTP API (no SDK needed).
 * Needs RESEND_API_KEY, and EMAIL_FROM on a domain verified in Resend, e.g. "RafikiHub <no-reply@rafikihub.com>".
 */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Email isn't set up: add RESEND_API_KEY.");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM || "RafikiHub <no-reply@rafikihub.com>", to: [to], subject, text, html }),
  });
  if (!res.ok) throw new Error(`Resend refused the email (${res.status}): ${(await res.text()).slice(0, 200)}`);
}

/** The reset email: plain, readable, in the site's colours, with the link also written out in full. */
export function resetEmail(name: string, link: string) {
  const first = name.split(" ")[0] || "there";
  const text = `Hi ${first},

Someone (hopefully you) asked to reset the password for your RafikiHub account.

Choose a new password here: ${link}

The link works once and expires in an hour. If you didn't ask for this, ignore this email: your password stays the same.

RafikiHub · info@rafikihub.com`;
  const html = `<!doctype html><html><body style="margin:0;background:#121212;font-family:Helvetica,Arial,sans-serif;color:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#121212;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#181818;border-radius:10px;padding:32px">
<tr><td style="font-weight:900;font-size:22px;letter-spacing:1px;color:#FF8033">RAFIKI<span style="color:#ffffff">HUB</span></td></tr>
<tr><td style="padding-top:24px;font-size:16px;line-height:1.55;color:#cbcbcb">Hi ${esc(first)},<br><br>Someone (hopefully you) asked to reset the password for your RafikiHub account.</td></tr>
<tr><td style="padding:28px 0"><a href="${esc(link)}" style="display:inline-block;background:#FF8033;color:#121212;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:1.4px;text-transform:uppercase;padding:14px 28px;border-radius:999px">Choose a new password</a></td></tr>
<tr><td style="font-size:14px;line-height:1.55;color:#b3b3b3">The link works once and expires in an hour. If you didn't ask for this, ignore this email: your password stays the same.<br><br>If the button doesn't work, copy this link:<br><span style="color:#ffffff;word-break:break-all">${esc(link)}</span></td></tr>
<tr><td style="padding-top:28px;font-size:12px;color:#7c7c7c">RafikiHub · info@rafikihub.com</td></tr>
</table></td></tr></table></body></html>`;
  return { subject: "Reset your RafikiHub password", text, html };
}
