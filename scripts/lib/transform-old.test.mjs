// node --test scripts/lib/*.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseDump } from "./mysqldump.mjs";
import { dateOnly, fixText, height, htmlToBlocks, measurement, timestamp, transform } from "./transform-old.mjs";

const sql = readFileSync(new URL("./fixtures/old-sample.sql", import.meta.url), "utf8");
const out = transform(parseDump(sql), { assetsBase: "https://rafikihub.com" });
const byLegacy = (id) => out.accounts.find((a) => a.legacy_id === id);

test("helpers", () => {
  assert.equal(fixText("WanjirÅ© Mwangi"), "Wanjirũ Mwangi");
  assert.equal(fixText("NULL"), null);
  assert.equal(dateOnly("0000-00-00"), null);
  assert.equal(dateOnly("1995-06-15 00:00:00"), "1995-06-15");
  assert.equal(timestamp("2024-07-01T10:30"), "2024-07-01T10:30:00+03:00");
  assert.deepEqual(height("5 feet", "6 inches"), { feet: 5, inches: 6 });
  assert.deepEqual(height("175 cm", ""), { feet: 5, inches: 9 });
  assert.equal(height("NULL", ""), null);
  assert.deepEqual(measurement("34 inches"), { value: 34, unit: "inches" });
  assert.deepEqual(measurement("86 cm"), { value: 86, unit: "cm" });
  assert.deepEqual(htmlToBlocks("<p>Intro.</p><h3>Why</h3><p>Because &amp; so.</p>"), [{ text: "Intro." }, { heading: "Why", text: "Because & so." }]);
});

test("accounts: roles, duplicates, passwords and sensitive fields", () => {
  const ids = out.accounts.map((a) => a.legacy_id).sort((a, b) => a - b);
  // 1 admin, 7 rooms/studio and 8 (no email) are left out; 4 is a duplicate of 3's email
  assert.deepEqual(ids, [2, 3, 5, 6]);
  assert.equal(out.report.skipped["duplicate emails (kept the active or most recent account)"], 1);
  assert.equal(byLegacy(2).email, "casting@example.test");
  assert.equal(byLegacy(2).role, "casting");
  assert.equal(byLegacy(2).category, "Head of Casting");
  assert.equal(byLegacy(2).plan_id, "premium");
  assert.equal(byLegacy(3).name, "Wanjirũ Mwangi");
  assert.equal(byLegacy(3).hash_algo, "md5");
  assert.equal(byLegacy(3).phone, "+254 722222222");
  assert.equal(byLegacy(5).phone, "733333333");
  assert.equal(byLegacy(6).profile_url, null, "pets keep their account but get no profile");
  const json = JSON.stringify(out);
  for (const secret of ["12345678", "A00TAXPIN", "Ngong Road", "abc.pdf"]) assert.ok(!json.includes(secret), `${secret} must not be imported`);
});

test("profiles: fields, media order and publishing", () => {
  assert.deepEqual(out.profiles.map((p) => p.profile_url).sort(), ["Wanj3AbCdE", "otie5QwErT"]);
  const w = out.profiles.find((p) => p.profile_url === "Wanj3AbCdE");
  assert.equal(w.published, true);
  assert.equal(w.category, "Actress");
  const d = w.data;
  assert.equal(d.contactDetails.phone, null);
  assert.equal(d.contactDetails.email, null);
  assert.equal(d.contactDetails.website, null);
  assert.deepEqual(d.personalData.playingAge, { min: 22, max: 30 });
  assert.equal(d.personalData.dateOfBirth, "1995-06-15");
  assert.deepEqual(d.cities, ["Nairobi", "Mombasa"]);
  assert.equal(d.appearance.eyeColor, "Dark Brown");
  assert.equal(d.appearance.facialHair, null);
  assert.deepEqual(d.appearanceTraits, [{ trait: "Tatoo", location: "Left wrist" }]);
  assert.deepEqual(d.languages, ["Swahili", "English"]);
  assert.deepEqual(d.accents, ["Kikuyu"]);
  assert.deepEqual(d.skills, ["Contemporary dance"]);
  assert.deepEqual(d.credits.map((c) => [c.year, c.type]), [[2023, "Film"], [2021, "TV"]]);
  assert.equal(d.training[1].year, 2024);
  // the photo flagged as profile comes first; hidden photos (status 0) are dropped
  assert.deepEqual(d.media.headshots, ["https://rafikihub.com/assets/images/gallery/1700000002003.png", "https://rafikihub.com/assets/images/gallery/1700000001003.png"]);
  assert.equal(d.media.showreelUrl, "https://rafikihub.com/assets/videos/1700000004003.mp4");
  assert.deepEqual(d.media.documents, []);
  assert.deepEqual(d.furtherMeasurements.bustChest, { value: 34, unit: "inches" });
  assert.equal(d.furtherMeasurements.weightKg, 58);
  const o = out.profiles.find((p) => p.profile_url === "otie5QwErT");
  assert.equal(o.published, false, "visible = NO stays unpublished");
  assert.equal(o.category, "Make-up Artist");
  assert.deepEqual(o.data.personalData.height, { feet: 5, inches: 9 });
});

test("castings, applications, agents and payments", () => {
  assert.deepEqual(out.auditions.map((a) => a.legacy_id), [100, 101]);
  const [lead, old] = out.auditions;
  assert.equal(lead.status, "published");
  assert.deepEqual(lead.categories, ["Actress", "Independent Performer"]);
  assert.deepEqual(lead.countries, ["Kenya"]);
  assert.match(lead.body, /The role\n\nNeema, 25–30\.\n\nPaid\./);
  assert.equal(old.status, "closed");
  assert.equal(old.filled, true);
  assert.deepEqual(old.categories, []);
  assert.equal(out.applications.length, 1, "the duplicate and the ghost applicant are dropped");
  assert.deepEqual(out.agentLinks, [{ agent_legacy_id: 2, performer_legacy_id: 3, status: "approved", created_at: "2024-01-01T10:00:00+03:00" }]);
  assert.deepEqual(out.payments.map((p) => [p.legacy_key, p.status, p.amount_ksh]), [["billing:1", "success", 1250], ["billing:2", "pending", 250], ["history:1", "success", 2500]]);
});

test("inbox items and blog posts", () => {
  assert.equal(out.bookings[0].status, "confirmed");
  assert.equal(out.bookings[0].full_name, "Amina Hassan");
  assert.equal(out.locationRequests[0].services, "Permits, Local crew");
  assert.equal(out.locationRequests[0].details, "Need power & water.");
  const [post, draft] = out.articles;
  assert.equal(post.slug, "conversations-with-the-collective");
  assert.equal(post.published, true);
  assert.equal(post.data.image, "https://rafikihub.com/assets/images/blog/1685700000001.png");
  assert.deepEqual(post.data.content[1], { heading: "Why it matters", text: "Artists' wellbeing." });
  assert.equal(draft.published, false);
  assert.equal(draft.data.genre, "Member story");
  assert.ok(out.report.notes.some((n) => n.includes("1 old videos")));
});
