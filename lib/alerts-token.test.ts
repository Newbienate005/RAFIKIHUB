// @ts-nocheck -- run by node --test, which needs the .ts extension
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.SESSION_SECRET = "test-secret";
const { alertsToken, checkAlertsToken } = await import("./alerts-token.ts");

test("an unsubscribe link only works for the account it was made for", () => {
  const t = alertsToken(42);
  assert.equal(checkAlertsToken(42, t), true);
  assert.equal(checkAlertsToken(43, t), false, "another account");
  assert.equal(checkAlertsToken(42, t.slice(0, -1) + (t.endsWith("A") ? "B" : "A")), false, "edited token");
  assert.equal(checkAlertsToken(42, ""), false);
  assert.equal(checkAlertsToken(Number.NaN, t), false);
});
