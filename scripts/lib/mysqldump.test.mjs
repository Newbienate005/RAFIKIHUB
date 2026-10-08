// node --test scripts/lib
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseDump } from "./mysqldump.mjs";

test("reads CREATE TABLE columns, multi-row INSERTs, escapes, NULLs and numbers", () => {
  const sql = String.raw`-- phpMyAdmin SQL Dump
/*!40101 SET NAMES utf8mb4 */;
--
-- Table structure for table ${"`users`"}
--
CREATE TABLE ${"`users`"} (
  ${"`id`"} int(11) NOT NULL,
  ${"`name`"} varchar(100) DEFAULT NULL,
  ${"`bio`"} text,
  ${"`score`"} decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (${"`id`"})
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO ${"`users`"} VALUES (1,'O\'Brien; with semicolon','Line one\nLine two',3.50),(2,'It''s ok',NULL,-1),
(3,_utf8mb4'Wanjiru (Kamau)','a,b),(c',0x4869);
INSERT INTO ${"`blog`"} (${"`id`"}, ${"`title`"}) VALUES (7, 'Hello "world"');
`;
  const t = parseDump(sql);
  const u = t.get("users");
  assert.equal(u.length, 3);
  assert.deepEqual(u[0], { id: 1, name: "O'Brien; with semicolon", bio: "Line one\nLine two", score: 3.5 });
  assert.equal(u[1].name, "It's ok");
  assert.equal(u[1].bio, null);
  assert.equal(u[1].score, -1);
  assert.equal(u[2].name, "Wanjiru (Kamau)");
  assert.equal(u[2].bio, "a,b),(c");
  assert.equal(u[2].score, "Hi");
  assert.deepEqual(t.get("blog"), [{ id: 7, title: 'Hello "world"' }]);
});

test("an INSERT with no column list and no CREATE TABLE is an error, not a silent skip", () => {
  assert.throws(() => parseDump("INSERT INTO `x` VALUES (1);"), /CREATE TABLE/);
});

test("only reads the tables it's asked for, and reports the rest as skipped", () => {
  const sql = "CREATE TABLE `a` (\n  `id` int\n);\nCREATE TABLE `emails` (\n  `id` int\n);\nINSERT INTO `a` VALUES (1);\nINSERT INTO `emails` VALUES (1),(2);";
  const t = parseDump(sql, { only: new Set(["a"]) });
  assert.deepEqual([...t.keys()], ["a"]);
  assert.ok(t.skipped.get("emails") > 0);
});
