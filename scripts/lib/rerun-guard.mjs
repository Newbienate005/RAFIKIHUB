/**
 * Re-running the old-site import must not undo what was done on the new site.
 * Given this dump's accounts and profiles plus what's already in the database, decides each
 * account's profile link and which profile rows may be written. Pure: no database access.
 *
 * - An account keeps the profile link it already has. Link names are worked out again from every
 *   dump, so without this a re-run could point one member's account at another member's profile.
 * - A link already held by a different account is never handed to someone else.
 * - Profiles the admin deleted (deletedUrls) are not recreated or relinked.
 *
 * @param {object} o
 * @param {{ legacy_id: number, profile_url: string | null }[]} o.accounts  this dump's accounts
 * @param {{ profile_url: string, data: object }[]} o.profiles              this dump's profiles
 * @param {Map<number, string | null>} o.existing   legacy_id → profile_url, for accounts already imported
 * @param {Map<string, number | null>} o.takenBy    profile_url → legacy_id of the account holding it (null = a new-site account)
 * @param {Set<string>} o.deletedUrls               profile links the admin deleted
 */
export function planRerun({ accounts, profiles, existing, takenBy, deletedUrls }) {
  const taken = new Map(takenBy);
  const finalFor = new Map(); // legacy_id → the link this account ends up with
  const ownerOfDumpUrl = new Map();
  const free = (url, legacyId) => url && !deletedUrls.has(url) && (!taken.has(url) || taken.get(url) === legacyId);

  for (const a of accounts) {
    if (a.profile_url) ownerOfDumpUrl.set(a.profile_url, a.legacy_id);
    const kept = existing.get(a.legacy_id);
    const url = kept ?? (free(a.profile_url, a.legacy_id) ? a.profile_url : null);
    finalFor.set(a.legacy_id, url);
    if (url) taken.set(url, a.legacy_id);
  }

  const outAccounts = accounts.map((a) => ({ ...a, profile_url: finalFor.get(a.legacy_id) }));
  const outProfiles = [];
  let dropped = 0;
  for (const p of profiles) {
    const owner = ownerOfDumpUrl.get(p.profile_url);
    // A profile follows its account's link; one whose account has none (or no account) only keeps a free link
    const url = owner !== undefined ? finalFor.get(owner) : free(p.profile_url, undefined) ? p.profile_url : null;
    if (!url || deletedUrls.has(url)) { dropped++; continue; }
    outProfiles.push(url === p.profile_url ? p : { ...p, profile_url: url, data: { ...p.data, profileUrl: url } });
  }
  return { accounts: outAccounts, profiles: outProfiles, dropped };
}
