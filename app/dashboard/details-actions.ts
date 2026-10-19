"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/admin/AdminForm";
import { countries } from "@/lib/countries";
import { getDb } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { MEMBER_DAYS, SESSION_COOKIE, cookieOptions, encodeSession, getSession } from "@/lib/session";

/** A member updating their own name, phone and country. Email and password change through their own flows. */
export async function updateMyDetails(_prev: FormState, form: FormData): Promise<FormState> {
  const s = await getSession();
  if (s?.kind !== "member" || !s.accountId) return { message: "Your session has ended. Sign in again to save." };
  const db = getDb();
  if (!db) return { message: "Saving isn't available right now. Try again soon." };

  const name = String(form.get("name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const country = String(form.get("country") ?? "").trim();
  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 160) errors.name = "Add your full name.";
  if (phone.replace(/\D/g, "").length < 7 || phone.length > 40) errors.phone = "Enter a phone number, including the country code, e.g. +254.";
  if (!(countries as readonly string[]).includes(country)) errors.country = "Choose your country from the list.";
  if (Object.keys(errors).length) return { errors, message: "Some fields need attention." };

  const changed = await db.update(accounts).set({ name, phone, country }).where(eq(accounts.id, s.accountId)).returning({ id: accounts.id });
  if (!changed.length) return { message: "We couldn't find your account. Sign in again, or email info@rafikihub.com." };

  // The dashboard greets people by the name in their session: refresh it so the new name shows at once
  const token = encodeSession({ ...s, name }, MEMBER_DAYS);
  if (token) (await cookies()).set(SESSION_COOKIE, token, cookieOptions(MEMBER_DAYS));
  revalidatePath(`/dashboard/${s.role}`);
  redirect(`/dashboard/${s.role}?details=saved#details`);
}
