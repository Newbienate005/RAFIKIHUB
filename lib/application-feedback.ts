import { after } from "next/server";
import { eq } from "drizzle-orm";
import { configuredAppUrl } from "@/lib/app-url";
import { applicationLabel } from "@/lib/dashboard";
import type { getDb } from "@/lib/db";
import { accounts, auditionApplications, auditions } from "@/lib/db/schema";
import { emailConfigured, noticeEmail, sendEmail } from "@/lib/email";

type Db = NonNullable<ReturnType<typeof getDb>>;

const messages: Record<string, string> = {
  shortlisted: "Good news: you've been shortlisted. The casting team will be in touch if they'd like to see you.",
  "audition-booked": "You've been asked to audition. Look out for a call or email from the casting team with the time and place.",
  declined: "Thank you for applying. This time the casting team has gone with other performers. Keep your profile up to date: new castings go out every week.",
};

/** "Application feedback", as the old site sent: tells the performer when a casting director or the admin moves their application on. */
export function sendApplicationFeedback(db: Db, applicationId: number, status: string) {
  const message = messages[status];
  if (!message || !emailConfigured()) return;
  after(async () => {
    try {
      const [a] = await db
        .select({ name: accounts.name, email: accounts.email, title: auditions.title })
        .from(auditionApplications)
        .innerJoin(accounts, eq(accounts.id, auditionApplications.applicantId))
        .innerJoin(auditions, eq(auditions.id, auditionApplications.auditionId))
        .where(eq(auditionApplications.id, applicationId))
        .limit(1);
      if (!a?.email) return;
      await sendEmail({
        to: a.email,
        ...noticeEmail({
          name: a.name,
          subject: `${applicationLabel(status)}: ${a.title}`.slice(0, 140),
          paragraphs: [`An update on your application for "${a.title}".`, message],
          button: { label: "See my applications", href: `${configuredAppUrl()}/dashboard/performer?tab=opportunities` },
        }),
      });
    } catch (e) {
      console.error("[applications] couldn't send the feedback email", e);
    }
  });
}
