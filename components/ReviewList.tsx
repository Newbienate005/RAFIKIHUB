import { stars } from "@/lib/reviews";

type Review = { id: number; rating: number; body: string; author: string; createdAt: Date };

/** Approved reviews with their average, for profiles and the services page. Renders nothing when there are none. */
export function ReviewList({ items }: { items: Review[] }) {
  if (!items.length) return null;
  const avg = items.reduce((n, r) => n + r.rating, 0) / items.length;
  return (
    <div className="reviews">
      <p className="reviews__avg"><span aria-hidden="true">{stars(avg)}</span> <strong>{avg.toFixed(1)} out of 5</strong> <span className="small">from {items.length} review{items.length > 1 ? "s" : ""}</span></p>
      <ul className="reviews__list">
        {items.map((r) => (
          <li key={r.id}>
            <span className="reviews__stars" aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span>
            <p>&ldquo;{r.body}&rdquo;</p>
            <span className="small">{r.author} · {r.createdAt.toLocaleDateString("en-KE", { month: "short", year: "numeric" })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
