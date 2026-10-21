// @ts-nocheck -- run by node --test, which needs the .ts extension
import { test } from "node:test";
import assert from "node:assert/strict";
import { clientIp } from "./rate-limit.ts";

const req = (h: Record<string, string>) => new Request("https://example.test/", { headers: h });

test("clientIp ignores the address a visitor puts first in X-Forwarded-For", () => {
  assert.equal(clientIp(req({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "6.6.6.6, 1.1.1.1" })), "1.1.1.1");
  assert.equal(clientIp(req({ "x-forwarded-for": "6.6.6.6, 2.2.2.2" })), "2.2.2.2");
  assert.equal(clientIp(req({})), "unknown");
});
