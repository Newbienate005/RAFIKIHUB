/**
 * Transactional email over HTTP (no SDK needed), through Elastic Email or Resend.
 * Set ELASTIC_EMAIL_API_KEY (used first) or RESEND_API_KEY, and EMAIL_FROM on a domain verified with
 * that service, e.g. "RafikiHub <no-reply@rafikihub.com>".
 */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const emailConfigured = () => Boolean(process.env.ELASTIC_EMAIL_API_KEY || process.env.RESEND_API_KEY);

type Message = { to: string; subject: string; text: string; html: string };

export async function sendEmail(m: Message) {
  const from = process.env.EMAIL_FROM || "RafikiHub <no-reply@rafikihub.com>";
  // A stuck email service mustn't hang the request
  const signal = AbortSignal.timeout(10_000);

  const elastic = process.env.ELASTIC_EMAIL_API_KEY;
  if (elastic) {
    const res = await fetch("https://api.elasticemail.com/v4/emails/transactional", {
      method: "POST",
      headers: { "X-ElasticEmail-ApiKey": elastic, "Content-Type": "application/json" },
      body: JSON.stringify({
        Recipients: { To: [m.to] },
        Content: {
          From: from,
          Subject: m.subject,
          Body: [
            { ContentType: "HTML", Charset: "utf-8", Content: m.html },
            { ContentType: "PlainText", Charset: "utf-8", Content: m.text },
          ],
        },
      }),
      signal,
    });
    if (!res.ok) throw new Error(`Elastic Email refused the email (${res.status}): ${(await res.text()).slice(0, 200)}`);
    return;
  }

  const resend = process.env.RESEND_API_KEY;
  if (!resend) throw new Error("Email isn't set up: add ELASTIC_EMAIL_API_KEY.");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [m.to], subject: m.subject, text: m.text, html: m.html }),
    signal,
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

/** Tells the team a form came in, so nothing waits unseen in /admin. Goes to NOTIFY_EMAIL, else the site address. */
export function submissionEmail(form: string, data: Record<string, unknown>, adminUrl: string) {
  const rows = Object.entries(data).filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "");
  const lines = rows.map(([k, v]) => `${k}: ${String(v)}`).join("\n");
  const text = `New ${form} on RafikiHub\n\n${lines}\n\nOpen the inbox: ${adminUrl}`;
  const cells = rows.map(([k, v]) => `<tr><td style="color:#555;vertical-align:top">${esc(k)}</td><td>${esc(String(v)).replace(/\n/g, "<br>")}</td></tr>`).join("");
  const html = `<!doctype html><html><body style="font-family:Helvetica,Arial,sans-serif;color:#121212">
<h2 style="margin:0 0 12px">New ${esc(form)} on RafikiHub</h2>
<table cellpadding="6" style="border-collapse:collapse">${cells}</table>
<p><a href="${esc(adminUrl)}">Open the inbox</a></p></body></html>`;
  return { subject: `New ${form}: ${String(rows.find(([k]) => /name|company|organization/i.test(k))?.[1] ?? "RafikiHub")}`.slice(0, 140), text, html };
}

type Notice = { name: string; subject: string; paragraphs: string[]; button?: { label: string; href: string }; footer?: { label: string; href: string } };

/** A short branded email to a member or visitor (welcome, "we got your request", application news). Same look as the reset email. */
export function noticeEmail({ name, subject, paragraphs, button, footer }: Notice) {
  const first = name.split(" ")[0] || "there";
  const text = [`Hi ${first},`, ...paragraphs, ...(button ? [`${button.label}: ${button.href}`] : []), "RafikiHub · info@rafikihub.com", ...(footer ? [`${footer.label}: ${footer.href}`] : [])].join("\n\n");
  const body = paragraphs.map((p) => esc(p)).join("<br><br>");
  const html = `<!doctype html><html><body style="margin:0;background:#121212;font-family:Helvetica,Arial,sans-serif;color:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#121212;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#181818;border-radius:10px;padding:32px">
<tr><td style="font-weight:900;font-size:22px;letter-spacing:1px;color:#FF8033">RAFIKI<span style="color:#ffffff">HUB</span></td></tr>
<tr><td style="padding-top:24px;font-size:16px;line-height:1.55;color:#cbcbcb">Hi ${esc(first)},<br><br>${body}</td></tr>
${button ? `<tr><td style="padding:28px 0 4px"><a href="${esc(button.href)}" style="display:inline-block;background:#FF8033;color:#121212;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:1.4px;text-transform:uppercase;padding:14px 28px;border-radius:999px">${esc(button.label)}</a></td></tr>` : ""}
<tr><td style="padding-top:28px;font-size:12px;color:#7c7c7c">RafikiHub · info@rafikihub.com · Park Place, Parklands, Nairobi${footer ? `<br><a href="${esc(footer.href)}" style="color:#b3b3b3">${esc(footer.label)}</a>` : ""}</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

type BulkRecipient = { email: string; fields: Record<string, string> };

/**
 * The same email to many people, each with their own merge fields: write `{name}` in the subject or body and give each
 * recipient `fields.name`. Elastic Email's bulk endpoint fills them in per person, 500 recipients a call; the Resend
 * fallback sends one by one. Nobody sees anyone else's address.
 */
export async function sendBulk(recipients: BulkRecipient[], m: Omit<Message, "to">) {
  const from = process.env.EMAIL_FROM || "RafikiHub <no-reply@rafikihub.com>";
  const elastic = process.env.ELASTIC_EMAIL_API_KEY;
  if (elastic) {
    for (let i = 0; i < recipients.length; i += 500) {
      const res = await fetch("https://api.elasticemail.com/v4/emails", {
        method: "POST",
        headers: { "X-ElasticEmail-ApiKey": elastic, "Content-Type": "application/json" },
        body: JSON.stringify({
          Recipients: recipients.slice(i, i + 500).map((r) => ({ Email: r.email, Fields: r.fields })),
          Content: {
            From: from,
            Subject: m.subject,
            Body: [
              { ContentType: "HTML", Charset: "utf-8", Content: m.html },
              { ContentType: "PlainText", Charset: "utf-8", Content: m.text },
            ],
          },
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) throw new Error(`Elastic Email refused the bulk email (${res.status}): ${(await res.text()).slice(0, 200)}`);
    }
    return;
  }
  const fill = (s: string, f: Record<string, string>) => s.replace(/\{(\w+)\}/g, (all, k) => f[k] ?? all);
  for (const r of recipients) await sendEmail({ to: r.email, subject: fill(m.subject, r.fields), html: fill(m.html, r.fields), text: fill(m.text, r.fields) });
}
