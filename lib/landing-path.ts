/** Where to go after signing in: only a path on this site, never another host. */
export function landingPath(next: string | null, base: string) {
  // Tab, newline and backslash are stripped or rewritten by URL parsers ("/\t/evil.com" becomes "//evil.com"), so refuse them
  if (!next || /[\u0000- \\]/.test(next) || !next.startsWith("/")) return "/admin";
  const from = new URL(base);
  const to = new URL(next, from);
  return to.origin === from.origin ? to.pathname + to.search + to.hash : "/admin";
}
