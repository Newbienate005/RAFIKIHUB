/**
 * True when a POST came from a page on this site. Browsers send Origin on every cross-site POST,
 * so a form on another website (login CSRF, planting a session) is turned away here.
 * Requests without Origin and Sec-Fetch-Site (scripts, old clients) carry no cookies to abuse and pass.
 */
export function fromThisSite(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const site = req.headers.get("sec-fetch-site");
  return !site || site === "same-origin" || site === "none";
}
