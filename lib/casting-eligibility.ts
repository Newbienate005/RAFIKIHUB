/** Who may apply to a casting (no imports, so it can be unit tested). The old site checked the same three things. */

export type CastingRules = { status: string; filled: boolean; closesOn: string; gender: string; categories: string[]; countries: string[] };
export type Applicant = { category?: string | null; country?: string | null; gender?: string | null };

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** null when they can apply, otherwise the reason they can't, ready to show them. `today` is yyyy-mm-dd in Nairobi. */
export function cannotApply(c: CastingRules, m: Applicant, today: string): string | null {
  if (c.status !== "published" || c.filled || c.closesOn < today) return "This casting has closed.";
  if (c.categories.length && !(m.category && c.categories.some((x) => same(x, m.category!)))) return `This casting is for ${c.categories.join(", ")}.`;
  if (c.countries.length && !(m.country && c.countries.some((x) => same(x, m.country!)))) return `This casting is open to performers in ${c.countries.join(", ")}.`;
  // Gender only counts when the profile records one: most imported profiles don't
  if (c.gender !== "Everybody" && m.gender && !same(c.gender, m.gender)) return `This casting is for ${c.gender.toLowerCase()} performers.`;
  return null;
}
