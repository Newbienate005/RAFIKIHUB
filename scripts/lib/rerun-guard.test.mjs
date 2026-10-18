import assert from "node:assert/strict";
import { test } from "node:test";
import { planRerun } from "./rerun-guard.mjs";

const prof = (url) => ({ profile_url: url, data: { profileUrl: url, fullName: url } });
const run = (o) => planRerun({ existing: new Map(), takenBy: new Map(), deletedUrls: new Set(), ...o });

test("first import keeps the dump's links", () => {
  const r = run({ accounts: [{ legacy_id: 1, profile_url: "jane-doe" }], profiles: [prof("jane-doe")] });
  assert.equal(r.accounts[0].profile_url, "jane-doe");
  assert.equal(r.profiles.length, 1);
});

test("an account keeps the link it already has when the dump renames it", () => {
  const r = run({
    accounts: [{ legacy_id: 1, profile_url: "jane-doe-2" }],
    profiles: [prof("jane-doe-2")],
    existing: new Map([[1, "jane-doe"]]),
    takenBy: new Map([["jane-doe", 1]]),
  });
  assert.equal(r.accounts[0].profile_url, "jane-doe");
  assert.equal(r.profiles[0].profile_url, "jane-doe");
  assert.equal(r.profiles[0].data.profileUrl, "jane-doe");
});

test("a link held by another account is never handed over", () => {
  // Member 10 owns jane-doe; in the new dump member 5 (new) is the one named jane-doe
  const r = run({
    accounts: [{ legacy_id: 5, profile_url: "jane-doe" }, { legacy_id: 10, profile_url: "jane-doe-2" }],
    profiles: [prof("jane-doe"), prof("jane-doe-2")],
    existing: new Map([[10, "jane-doe"]]),
    takenBy: new Map([["jane-doe", 10]]),
  });
  assert.equal(r.accounts.find((a) => a.legacy_id === 5).profile_url, null);
  assert.equal(r.accounts.find((a) => a.legacy_id === 10).profile_url, "jane-doe");
  // Member 5's profile isn't written over member 10's row
  assert.deepEqual(r.profiles.map((p) => p.profile_url), ["jane-doe"]);
  assert.equal(r.profiles[0].data.fullName, "jane-doe-2");
});

test("a link held by a new-site account is not taken", () => {
  const r = run({ accounts: [{ legacy_id: 3, profile_url: "sam" }], profiles: [prof("sam")], takenBy: new Map([["sam", null]]) });
  assert.equal(r.accounts[0].profile_url, null);
  assert.equal(r.profiles.length, 0);
});

test("a deleted profile is not recreated or relinked", () => {
  const r = run({
    accounts: [{ legacy_id: 7, profile_url: "gone" }],
    profiles: [prof("gone")],
    existing: new Map([[7, null]]),
    deletedUrls: new Set(["gone"]),
  });
  assert.equal(r.accounts[0].profile_url, null);
  assert.equal(r.profiles.length, 0);
  assert.equal(r.dropped, 1);
});
