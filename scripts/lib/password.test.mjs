// node --test scripts/lib/*.test.mjs
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { hashPassword, newToken, passwordProblem, tokenHash, verifyPassword } from "../../lib/password.ts";

const md5 = (s) => createHash("md5").update(s).digest("hex");

test("old-site MD5 passwords: both of the old site's forms are accepted, then flagged for re-hashing", async () => {
  // Sign-up stored md5(trim(strip_tags(password)))
  assert.deepEqual(await verifyPassword(md5("Simba2019"), "md5", "  Simba2019 "), { ok: true, needsRehash: true });
  assert.deepEqual(await verifyPassword(md5("Simba2019"), "md5", "<b>Simba2019</b>"), { ok: true, needsRehash: true });
  // Some change-password forms stored md5(password) exactly
  assert.deepEqual(await verifyPassword(md5(" spaced "), "md5", " spaced "), { ok: true, needsRehash: true });
  assert.deepEqual(await verifyPassword(md5("Simba2019"), "md5", "simba2019"), { ok: false, needsRehash: false });
  assert.deepEqual(await verifyPassword(md5("x").toUpperCase(), "md5", "x"), { ok: true, needsRehash: true });
});

test("new passwords use scrypt with a fresh salt, and only the right password matches", async () => {
  const a = await hashPassword("correct horse battery");
  const b = await hashPassword("correct horse battery");
  assert.equal(a.algo, "scrypt");
  assert.match(a.hash, /^scrypt\$16384\$8\$1\$[\w-]+\$[\w-]+$/);
  assert.notEqual(a.hash, b.hash, "salted: the same password never gives the same hash");
  assert.deepEqual(await verifyPassword(a.hash, a.algo, "correct horse battery"), { ok: true, needsRehash: false });
  assert.deepEqual(await verifyPassword(a.hash, a.algo, "correct horse batter"), { ok: false, needsRehash: false });
});

test("missing or tampered hashes never verify", async () => {
  assert.equal((await verifyPassword(null, null, "x")).ok, false);
  assert.equal((await verifyPassword("scrypt$16384$8$1$$", "scrypt", "x")).ok, false);
  assert.equal((await verifyPassword("plaintext", null, "plaintext")).ok, false, "an unknown format is never compared as plain text");
  assert.equal((await verifyPassword(md5("x"), "md5", "")).ok, false);
  const good = (await hashPassword("anything at all")).hash;
  assert.equal((await verifyPassword(good.slice(0, -10), "scrypt", "anything at all")).ok, false, "a truncated hash doesn't throw");
});

test("reset tokens are long, random and stored only as a hash", () => {
  const t = newToken();
  assert.ok(t.length >= 43);
  assert.notEqual(t, newToken());
  assert.match(tokenHash(t), /^[a-f0-9]{64}$/);
  assert.notEqual(tokenHash(t), t);
});

test("password rules", () => {
  assert.equal(passwordProblem("short"), "Use at least 8 characters.");
  assert.equal(passwordProblem("aaaaaaaaaa"), "That password is too easy to guess.");
  assert.equal(passwordProblem("password123"), "That password is too easy to guess.");
  assert.equal(passwordProblem("a long sentence I'll remember"), null);
});
