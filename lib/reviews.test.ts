// @ts-nocheck -- run by node --test, which needs the .ts extension
import assert from "node:assert/strict";
import { test } from "node:test";
import { checkReview, stars } from "./reviews.ts";

test("checkReview accepts a normal review and tidies spaces", () => {
  assert.deepEqual(checkReview({ kind: "service", rating: "5", body: "  Great   headshots, very patient. " }), { kind: "service", rating: 5, body: "Great headshots, very patient." });
});

test("checkReview rejects bad input", () => {
  assert.ok("error" in checkReview({ kind: "film", rating: 5, body: "Lovely to work with" }));
  assert.ok("error" in checkReview({ kind: "casting", rating: 0, body: "Lovely to work with" }));
  assert.ok("error" in checkReview({ kind: "casting", rating: 4.5, body: "Lovely to work with" }));
  assert.ok("error" in checkReview({ kind: "casting", rating: 4, body: "ok" }));
  assert.ok("error" in checkReview({ kind: "casting", rating: 4, body: "x".repeat(1001) }));
  assert.ok("error" in checkReview({ kind: "casting", rating: 4, body: "Cheap followers at https://spam.example" }));
});

test("stars rounds to whole stars", () => {
  assert.equal(stars(4), "★★★★☆");
  assert.equal(stars(4.6), "★★★★★");
});
