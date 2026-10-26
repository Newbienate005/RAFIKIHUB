import type { BatchItem } from "drizzle-orm/batch";
import { sql } from "drizzle-orm";
import { after, NextResponse } from "next/server";
import { notifyTeam } from "@/lib/api";
import { appUrl } from "@/lib/app-url";
import { emailConfigured, noticeEmail, sendEmail } from "@/lib/email";
import { emptyProfile } from "@/lib/admin/profile-form";
import { roleForCategory } from "@/lib/dashboard";
import { profileCategories, type TalentProfile } from "@/lib/data";
import { getDb } from "@/lib/db";
import { accounts, members, talentProfiles } from "@/lib/db/schema";
import { hashPassword } from "@/lib/password";
import { profileCompleteness } from "@/lib/profile-completeness";
import { freeProfileUrl } from "@/lib/profile-url";
import { clientIp, failures, recordFailure } from "@/lib/rate-limit";
import { fromThisSite } from "@/lib/same-site";
import { MEMBER_DAYS, SESSION_COOKIE, cookieOptions, encodeSession, passwordVersion } from "@/lib/session";
import { joinSchema } from "@/lib/validation";

const EMAIL_TAKEN = "There's already an account with this email. Log in, or reset your password if you've forgotten it.";

/** The profile category for what they picked, so the profile shows up in the right searches. */
function profileCategoryFor(joiningAs: string, talentCategory?: string): TalentProfile["category"] {
  if (talentCategory && (profileCategories as readonly string[]).includes(talentCategory)) return talentCategory as TalentProfile["category"];
  if (/young/i.test(joiningAs)) return "Young Performer";
  if (/crew/i.test(joiningAs)) return "Crew";
  if (/pet|animal/i.test(joiningAs)) return "Pet";
  return "Actor";
}

/**
 * Joining creates a real account straight away, as the old site did: a password, an unpublished
 * starter profile for performers, and the application in the admin inbox. The new member is signed in
 * and can fill in their profile at once; the RafikiHub team publishes it after checking.
 */
export async function POST(req: Request) {
  if (!fromThisSite(req)) return NextResponse.json({ ok: false, error: "This form has to be sent from rafikihub.com. Reload the page and try again." }, { status: 403 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "Joining isn't available right now. Email info@rafikihub.com and we'll set you up." }, { status: 503 });

  const limitKey = `form:/api/join:${clientIp(req)}`;
  if ((await failures(db, limitKey, 60 * 60).catch(() => 0)) >= 10) {
    return NextResponse.json({ ok: false, error: "You've sent this form a lot in the last hour. Wait a while, or email info@rafikihub.com." }, { status: 429 });
  }

  const parsed = joinSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    return NextResponse.json({ ok: false, error: "Some fields need attention.", fields: Object.fromEntries(Object.entries(flat).map(([k, v]) => [k, v?.[0] ?? ""])) }, { status: 400 });
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // bot filled the hidden field

  const email = d.email.toLowerCase();
  const [taken] = await db.select({ id: accounts.id }).from(accounts).where(sql`lower(${accounts.email}) = ${email}`).limit(1);
  if (taken) return NextResponse.json({ ok: false, error: "Some fields need attention.", fields: { email: EMAIL_TAKEN } }, { status: 409 });

  const role = roleForCategory(d.category);
  const { hash, algo } = await hashPassword(d.password);
  const category = profileCategoryFor(d.category, d.talentCategory || undefined);
  const plan = d.plan && d.plan !== "undecided" ? d.plan : null;

  // Performers, crew and pets get a profile to fill in; casting accounts don't have one
  const url = role === "performer" ? await freeProfileUrl(db, d.fullName) : null;
  const base = emptyProfile();
  const profile: TalentProfile | null = url
    ? { ...base, profileUrl: url, fullName: d.fullName, category, personalData: { ...base.personalData, dateOfBirth: d.dateOfBirth || null, country: d.country }, contactDetails: { ...base.contactDetails, country: d.country } }
    : null;

  // What the team sees in the inbox, including the details that have no field of their own
  const extra = [
    d.talentCategory ? `Category: ${d.talentCategory}` : null,
    `Country: ${d.country}`,
    d.gender ? `Gender: ${d.gender}` : null,
    d.dateOfBirth ? `Date of birth: ${d.dateOfBirth}` : null,
    d.guardian ? `Registered by: ${d.guardian.toLowerCase()}` : null,
  ].filter(Boolean).join(" · ");
  const message = [extra, d.message].filter(Boolean).join("\n\n");

  const queries: [BatchItem<"pg">, ...BatchItem<"pg">[]] = [
    db.insert(accounts).values({
      email, name: d.fullName, role, category: d.talentCategory || d.category, passwordHash: hash, hashAlgo: algo,
      // Works straight away; "unverified" until the team has checked the application
      status: "unverified", phone: d.phone, country: d.country, profileUrl: url, planId: plan,
    }).returning({ id: accounts.id }),
    db.insert(members).values({ fullName: d.fullName, email, phone: d.phone, category: d.category, plan: d.plan || null, location: d.location || null, message: message || null }),
  ];
  if (profile && url) {
    queries.push(db.insert(talentProfiles).values({
      profileUrl: url, fullName: d.fullName, category, published: false, represented: false,
      data: profile, source: "member", completeness: profileCompleteness(profile).percent,
    }));
  }

  let accountId: number;
  try {
    const [created] = (await db.batch(queries)) as unknown as [{ id: number }[]];
    accountId = created[0].id;
  } catch (e) {
    if ((e as { code?: string })?.code === "23505") {
      // Same email at the same moment, or the link name was just taken: nothing was saved
      return NextResponse.json({ ok: false, error: "Some fields need attention.", fields: { email: EMAIL_TAKEN } }, { status: 409 });
    }
    console.error("[join] couldn't create the account", e);
    return NextResponse.json({ ok: false, error: "We couldn't create your account just now. Try again in a minute, or email info@rafikihub.com." }, { status: 500 });
  }

  await recordFailure(db, limitKey, 60 * 60).catch(() => {});
  notifyTeam(req, { "Full name": d.fullName, Email: email, Phone: d.phone, "Joining as": d.category, Details: message || "None" });
  if (emailConfigured()) {
    // No typed-in text (not even the name): the address isn't verified yet, and an account can only be made once per email
    const welcome = noticeEmail({
      name: "",
      subject: "Welcome to RafikiHub",
      paragraphs: [
        "Your RafikiHub account is ready. You can sign in any time with this email address and the password you chose.",
        role === "performer"
          ? "Next, fill in your profile: headshots, credits, skills and a showreel. Casting directors search by these, and the team checks every profile before it goes public."
          : "From your dashboard you can post castings, search the talent database and follow applications.",
        "If you didn't create this account, email info@rafikihub.com and we'll remove it.",
      ],
      button: { label: "Open my dashboard", href: `${appUrl(req)}/dashboard/${role}` },
    });
    after(() => sendEmail({ to: email, ...welcome }).catch((e) => console.error("[join] couldn't send the welcome email", e)));
  }

  const token = encodeSession(
    { kind: "member", role, accountId, pv: passwordVersion(hash), name: d.fullName, email, category: d.talentCategory || d.category, plan: plan ?? undefined, location: d.location || undefined },
    MEMBER_DAYS,
  );
  const res = NextResponse.json({ ok: true, redirect: `/dashboard/${role}?welcome=1` });
  if (token) res.cookies.set(SESSION_COOKIE, token, cookieOptions(MEMBER_DAYS));
  return res;
}
