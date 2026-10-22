// @ts-nocheck -- run by node --test, which needs the .ts extension
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.SESSION_SECRET = "test-secret";
const { encodeSession, decodeSession, passwordVersion } = await import("./session-token.ts");
const { landingPath } = await import("./landing-path.ts");

const member = { kind: "member", role: "performer", name: "Jane", email: "jane@example.test", accountId: 1, pv: passwordVersion("hash-1") };

test("a signed session decodes; a tampered or expired one doesn't", () => {
  const token = encodeSession(member, 1);
  assert.equal(decodeSession(token)?.name, "Jane");

  const [data, sig] = token.split(".");
  const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(data, "base64url").toString()), kind: "master" })).toString("base64url");
  assert.equal(decodeSession(`${forged}.${sig}`), null, "changed payload, old signature");
  assert.equal(decodeSession(`${data}.x${sig.slice(1)}`), null, "changed signature");
  assert.equal(decodeSession(encodeSession(member, -1)), null, "expired");
  assert.equal(decodeSession("not-a-token"), null);
  assert.equal(decodeSession(undefined), null);
});

test("a password reset changes the fingerprint, so older sessions stop matching", () => {
  assert.notEqual(passwordVersion("hash-1"), passwordVersion("hash-2"));
  assert.equal(passwordVersion("hash-1"), member.pv);
});

test("landingPath only ever sends people to a path on this site", () => {
  const base = "https://rafikihub.com/login";
  assert.equal(landingPath("/admin/members?q=a#top", base), "/admin/members?q=a#top");
  for (const bad of [null, "", "https://evil.com", "//evil.com", "/\t/evil.com", "/\\evil.com", "javascript:alert(1)", "admin"]) {
    assert.equal(landingPath(bad, base), "/admin", String(bad));
  }
});
