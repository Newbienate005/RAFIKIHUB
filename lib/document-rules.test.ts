// @ts-nocheck -- run by node --test, which needs the .ts extension
import { test } from "node:test";
import assert from "node:assert/strict";
import { documentGroup, sniffDocument } from "./document-rules.ts";

test("pets and under-18s need documents; adults don't", () => {
  const today = new Date("2026-11-02T10:00:00");
  assert.equal(documentGroup({ category: "Pet" }, today), "pet");
  assert.equal(documentGroup({ category: "Young Performer" }, today), "young");
  assert.equal(documentGroup({ category: "Actress", dateOfBirth: "2012-05-01" }, today), "young", "under 18 by birth date");
  assert.equal(documentGroup({ category: "Actress", dateOfBirth: "2008-11-02" }, today), null, "18 today");
  assert.equal(documentGroup({ category: "Actor" }, today), null);
  assert.equal(documentGroup({}, today), null);
});

test("only real PDFs and images get through, whatever the file claims to be", () => {
  const b = (...x) => new Uint8Array([...x, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(sniffDocument(new TextEncoder().encode("%PDF-1.7 rest")), "application/pdf");
  assert.equal(sniffDocument(b(0xff, 0xd8, 0xff, 0xe0)), "image/jpeg");
  assert.equal(sniffDocument(b(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)), "image/png");
  assert.equal(sniffDocument(new TextEncoder().encode("RIFF1234WEBPVP8 ")), "image/webp");
  assert.equal(sniffDocument(new TextEncoder().encode("<html><script>")), null, "HTML renamed to .pdf");
  assert.equal(sniffDocument(b(0x4d, 0x5a)), null, "a Windows program");
  assert.equal(sniffDocument(new Uint8Array()), null);
});
