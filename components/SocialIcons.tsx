import { site } from "@/lib/site";

const icons: Record<keyof typeof site.social, { label: string; path: string }> = {
  instagram: { label: "Instagram", path: "M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.8a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-9.6a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" },
  facebook: { label: "Facebook", path: "M14 8V6.2c0-.8.2-1.2 1.4-1.2H17V2h-2.6C11.3 2 10 3.6 10 6.3V8H8v3h2v11h4V11h2.7l.3-3H14z" },
  youtube: { label: "YouTube", path: "M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15.1V8.9L15.5 12l-5.8 3.1z" },
  linkedin: { label: "LinkedIn", path: "M4.98 3.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM3 9.8h4V21H3V9.8zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.8z" },
};

export function SocialIcons() {
  return (
    <ul className="social">
      {(Object.keys(site.social) as (keyof typeof site.social)[]).map((k) => (
        <li key={k}>
          <a href={site.social[k]} target="_blank" rel="me noopener" aria-label={`RafikiHub on ${icons[k].label}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d={icons[k].path} fill="currentColor" /></svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
