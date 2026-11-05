// @ts-nocheck -- run by node --test, which needs the .ts extension
import { test } from "node:test";
import assert from "node:assert/strict";
import { callbackVerdict, extendPlan, mpesaPhone } from "./mpesa-utils.ts";

test("mpesaPhone accepts the ways Kenyans write a number, and nothing else", () => {
  for (const ok of ["0712345678", "712345678", "254712345678", "+254 712 345 678", "0112345678"]) {
    assert.match(mpesaPhone(ok), /^254(7|1)\d{8}$/, ok);
  }
  for (const bad of ["", "12345", "0812345678", "+1 415 555 0100", "07123456789"]) assert.equal(mpesaPhone(bad), null, bad);
});

test("extendPlan adds to time still left, and starts from today once expired", () => {
  const now = new Date("2026-10-27T10:00:00Z");
  assert.equal(extendPlan(null, 1, now).toISOString(), "2026-11-27T10:00:00.000Z");
  assert.equal(extendPlan(new Date("2026-11-10T10:00:00Z"), 6, now).toISOString(), "2027-05-10T10:00:00.000Z");
  assert.equal(extendPlan(new Date("2026-01-01T00:00:00Z"), 12, now).toISOString(), "2027-10-27T10:00:00.000Z");
});

test("callbackVerdict only switches a plan on for a success, for the exact amount, on our reference", () => {
  const p = { reference: "RH12AB34CD56", amountKsh: 1250 };
  assert.deepEqual(callbackVerdict(p, { reference: "RH12AB34CD56", success: true, amount: 1250 }), { action: "settle" });
  assert.deepEqual(callbackVerdict(p, { success: true, amount: "1250" }), { action: "settle" }, "Pesawise may send the amount as text, and may leave the reference out");
  assert.equal(callbackVerdict(p, { success: true, amount: 1 }).action, "ignore", "underpaid");
  assert.equal(callbackVerdict(p, { success: true, amount: 2500 }).action, "ignore", "a different amount");
  assert.equal(callbackVerdict(p, { success: true }).action, "ignore", "no amount");
  assert.equal(callbackVerdict(p, { reference: "RH99", success: true, amount: 1250 }).action, "ignore", "someone else's payment");
  assert.deepEqual(callbackVerdict(p, { success: false, amount: 1250 }), { action: "reject" });
  assert.deepEqual(callbackVerdict(p, { success: "true", amount: 1250 }), { action: "reject" }, "only a real true counts as success");
});
