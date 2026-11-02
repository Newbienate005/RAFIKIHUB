/** What can be reviewed, and the checks on a review's text that don't need the database. */
export const reviewKinds = ["performer", "casting", "service"] as const;
export type ReviewKind = (typeof reviewKinds)[number];

export const reviewLabels: Record<ReviewKind, string> = {
  performer: "Casting director on a performer",
  casting: "Performer on a casting",
  service: "Member on a service",
};

/** Returns the cleaned review, or the reason it can't be saved. */
export function checkReview(input: { kind: unknown; rating: unknown; body: unknown }): { kind: ReviewKind; rating: number; body: string } | { error: string } {
  const kind = String(input.kind) as ReviewKind;
  if (!reviewKinds.includes(kind)) return { error: "Unknown review." };
  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Choose 1 to 5 stars." };
  const body = String(input.body ?? "").replace(/\s+/g, " ").trim();
  if (body.length < 10) return { error: "Write a sentence or two (at least 10 characters)." };
  if (body.length > 1000) return { error: "Keep it under 1,000 characters." };
  // Links are the usual spam: reviews are for words
  if (/https?:\/\/|www\./i.test(body)) return { error: "Please leave links out of reviews." };
  return { kind, rating, body };
}

/** "★★★★☆" for a rating, rounded to the nearest star. */
export const stars = (n: number) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
