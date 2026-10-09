import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * Member passwords. New ones are stored with scrypt (memory-hard, built into Node).
 * Imported old-site passwords are unsalted MD5 (hash_algo "md5"): they're accepted once, then re-hashed.
 * Stored format: scrypt$N$r$p$salt$hash (salt and hash base64url).
 */

const N = 16384, R = 8, P = 1, KEYLEN = 64;

const scrypt = (pw: string, salt: Buffer, opts: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) => scryptCb(pw, salt, KEYLEN, opts, (err, key) => (err ? reject(err) : resolve(key))));

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, { N, r: R, p: P, maxmem: 64 * 1024 * 1024 });
  return { hash: `scrypt$${N}$${R}$${P}$${salt.toString("base64url")}$${key.toString("base64url")}`, algo: "scrypt" as const };
}

const md5 = (s: string) => createHash("md5").update(s, "utf8").digest("hex");
const same = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** The old site hashed md5(trim(strip_tags(password))) at sign-up, and md5(password) on some change-password forms. */
const legacyCandidates = (pw: string) => [md5(pw.replace(/<[^>]*>/g, "").trim()), md5(pw)];

export async function verifyPassword(stored: string | null, algo: string | null, input: string): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (!stored || !input) return { ok: false, needsRehash: false };
  if (algo === "md5") {
    const ok = legacyCandidates(input).some((h) => same(h, stored.toLowerCase()));
    return { ok, needsRehash: ok };
  }
  const [kind, n, r, p, salt, hash] = stored.split("$");
  if (kind !== "scrypt" || !salt || !hash) return { ok: false, needsRehash: false };
  const key = await scrypt(input, Buffer.from(salt, "base64url"), { N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024 });
  const expected = Buffer.from(hash, "base64url");
  const ok = expected.length === key.length && timingSafeEqual(key, expected); // a damaged hash is a wrong password, not a crash
  return { ok, needsRehash: ok && Number(n) < N };
}

/** One-time tokens for reset links: the link carries the token, the database only its SHA-256. */
export const newToken = () => randomBytes(32).toString("base64url");
export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

export function passwordProblem(pw: string) {
  if (pw.length < 8) return "Use at least 8 characters.";
  if (pw.length > 200) return "That's too long: use up to 200 characters.";
  if (/^(.)\1+$/.test(pw) || /^(password|12345678|rafikihub)/i.test(pw)) return "That password is too easy to guess.";
  return null;
}
