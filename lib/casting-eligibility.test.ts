// @ts-nocheck -- run by node --test, which needs the .ts extension
import { test } from "node:test";
import assert from "node:assert/strict";
import { cannotApply } from "./casting-eligibility.ts";

const open = { status: "published", filled: false, closesOn: "2026-11-30", gender: "Everybody", categories: [], countries: [] };
const today = "2026-10-30";

test("an open casting for everyone takes anyone", () => {
  assert.equal(cannotApply(open, {}, today), null);
});

test("closed, filled, past or unpublished castings refuse everyone", () => {
  for (const c of [{ ...open, status: "closed" }, { ...open, filled: true }, { ...open, closesOn: "2026-10-29" }, { ...open, status: "draft" }]) {
    assert.match(cannotApply(c, { category: "Actor" }, today), /closed/);
  }
  assert.equal(cannotApply({ ...open, closesOn: today }, {}, today), null, "still open on its closing day");
});

test("category, country and (when known) gender must match, ignoring case", () => {
  const c = { ...open, categories: ["Actress", "Dancer"], countries: ["Kenya"], gender: "Female" };
  assert.equal(cannotApply(c, { category: "actress", country: "kenya", gender: "female" }, today), null);
  assert.match(cannotApply(c, { category: "Actor", country: "Kenya" }, today), /Actress, Dancer/);
  assert.match(cannotApply(c, { category: "Dancer", country: "Uganda" }, today), /Kenya/);
  assert.match(cannotApply(c, { category: "Dancer", country: "Kenya", gender: "Male" }, today), /female/);
  assert.equal(cannotApply(c, { category: "Dancer", country: "Kenya" }, today), null, "unknown gender isn't held against them");
});
