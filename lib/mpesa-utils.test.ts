// @ts-nocheck -- run by node --test, which needs the .ts extension
import { test } from "node:test";
import assert from "node:assert/strict";
import { extendPlan, mpesaPhone } from "./mpesa-utils.ts";

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
