const tz = "Africa/Nairobi";

export const longDate = (d: string) =>
  new Date(d).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "short", year: "numeric", timeZone: tz });

export const shortDate = (d: string) =>
  new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric", timeZone: tz });

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
