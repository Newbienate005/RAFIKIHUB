import { eq } from "drizzle-orm";
import type { getDb } from "@/lib/db";
import { talentProfiles } from "@/lib/db/schema";

type Db = NonNullable<ReturnType<typeof getDb>>;

/** A link name from someone's name: lowercase letters, numbers and dashes. */
export const slugify = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "member";

/** The first free profile link for this name: jane-doe, then jane-doe-2, jane-doe-3… */
export async function freeProfileUrl(db: Db, name: string) {
  const root = slugify(name);
  let url = root;
  for (let n = 2; (await db.select({ u: talentProfiles.profileUrl }).from(talentProfiles).where(eq(talentProfiles.profileUrl, url)).limit(1)).length; n++) url = `${root}-${n}`;
  return url;
}
