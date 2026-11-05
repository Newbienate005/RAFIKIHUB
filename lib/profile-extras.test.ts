// @ts-nocheck -- run by node --test, which needs the .ts extension
import assert from "node:assert/strict";
import { test } from "node:test";
import { flatSkills, skillEntriesOf, socialLink } from "./data.ts";

test("social links only point at their own site", () => {
  const ig = ["instagram.com"];
  assert.equal(socialLink("https://www.instagram.com/kate.snow/", ig), "https://www.instagram.com/kate.snow/");
  assert.equal(socialLink("https://instagram.com/kate", ig), "https://instagram.com/kate");
  assert.equal(socialLink("https://www.instagram.com/", ig), null, "the bare site isn't a profile");
  assert.equal(socialLink("http://instagram.com/kate", ig), null, "https only");
  assert.equal(socialLink("https://instagram.com.evil.example/kate", ig), null);
  assert.equal(socialLink("https://evilinstagram.com/kate", ig), null);
  assert.equal(socialLink("javascript:alert(1)", ig), null);
  assert.equal(socialLink("@kate", ig), null);
});

test("grouped skills fall back to the flat lists and flatten back the same", () => {
  const p = { skills: ["Swimming"], languages: ["Swahili"], accents: ["Kikuyu"] };
  const list = skillEntriesOf(p);
  assert.deepEqual(list.map((s) => s.group), ["accents", "languages", "other"]);
  assert.deepEqual(flatSkills(list), p);
  const grouped = [{ group: "sports", name: "Hockey", level: "Highly Skilled" }, { group: "languages", name: "English", level: "Native" }];
  assert.deepEqual(skillEntriesOf({ ...p, skillList: grouped }), grouped);
  assert.deepEqual(flatSkills(grouped), { skills: ["Hockey"], languages: ["English"], accents: [] });
});
