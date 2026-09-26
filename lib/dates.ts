const tz = "Africa/Nairobi";

export const longDate = (d: string) =>
  new Date(d).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "short", year: "numeric", timeZone: tz });

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** e.g. "26 Mar 2025". Formatted by hand so server and browser output match (ICU month names differ). */
export const shortDate = (d: string) => {
  const [y, m, day] = d.slice(0, 10).split("-").map(Number);
  return `${day} ${MONTHS[m - 1]} ${y}`;
};

/** Day and month for the date badge, e.g. { day: "26", month: "Mar" } */
export const badgeDate = (d: string) => {
  const date = new Date(d);
  return {
    day: date.toLocaleDateString("en-KE", { day: "2-digit", timeZone: tz }),
    month: date.toLocaleDateString("en-US", { month: "short", timeZone: tz }),
  };
};

/** Reading time in minutes, at about 200 words a minute */
export const readMinutes = (blocks: { heading?: string; text: string }[]) =>
  Math.max(1, Math.round(blocks.reduce((n, b) => n + `${b.heading ?? ""} ${b.text}`.split(/\s+/).length, 0) / 200));
