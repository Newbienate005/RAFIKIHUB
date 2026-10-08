/**
 * Reads a MySQL dump (phpMyAdmin "Export" or `mysqldump`) without needing MySQL.
 * Returns every table's rows as objects keyed by column name. Column names come from each
 * table's CREATE TABLE statement, or from the INSERT's own column list when it has one.
 *
 * Handles: backtick names, multi-row INSERTs, '' and \' escapes, \n \r \t \0 \Z \\ escapes,
 * NULL, numbers, _binary/_utf8mb4 prefixes, 0x… hex literals, and comments.
 */

/** Splits SQL into statements, respecting quotes and comments. */
function* statements(sql) {
  let start = 0;
  let i = 0;
  const n = sql.length;
  while (i < n) {
    const c = sql[i];
    if (c === "'" || c === '"' || c === "`") {
      const q = c;
      i++;
      while (i < n) {
        if (sql[i] === "\\" && q !== "`") { i += 2; continue; }
        if (sql[i] === q) {
          if (sql[i + 1] === q) { i += 2; continue; } // doubled quote
          break;
        }
        i++;
      }
      i++;
      continue;
    }
    if (c === "-" && sql[i + 1] === "-" && (sql[i + 2] === " " || sql[i + 2] === "\t" || sql[i + 2] === "\n" || sql[i + 2] === "\r")) {
      const end = sql.indexOf("\n", i);
      i = end === -1 ? n : end + 1;
      if (sql.slice(start, i).trim().startsWith("--")) start = i;
      continue;
    }
    if (c === "#" ) {
      const end = sql.indexOf("\n", i);
      i = end === -1 ? n : end + 1;
      continue;
    }
    if (c === "/" && sql[i + 1] === "*") {
      const end = sql.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (c === ";") {
      const stmt = sql.slice(start, i).trim();
      if (stmt) yield stmt;
      start = i + 1;
    }
    i++;
  }
  const rest = sql.slice(start).trim();
  if (rest) yield rest;
}

const unescape = (s) =>
  s.replace(/\\(.)/gs, (_, ch) => ({ n: "\n", r: "\r", t: "\t", 0: "\0", Z: "\x1a", b: "\b" })[ch] ?? ch);

/** Parses the "(…),(…)" part of an INSERT into arrays of values. */
function parseValues(src) {
  const rows = [];
  let i = 0;
  const n = src.length;
  const skipWs = () => { while (i < n && /\s/.test(src[i])) i++; };
  while (i < n) {
    skipWs();
    if (src[i] === ",") { i++; continue; }
    if (src[i] !== "(") break;
    i++;
    const row = [];
    for (;;) {
      skipWs();
      // charset introducers like _binary'…' or _utf8mb4'…'
      const intro = /^_[a-z0-9]+(?=')/i.exec(src.slice(i, i + 20));
      if (intro) i += intro[0].length;
      const c = src[i];
      if (c === "'" || c === '"') {
        const q = c;
        let j = i + 1;
        let out = "";
        while (j < n) {
          if (src[j] === "\\") { out += src.slice(j, j + 2); j += 2; continue; }
          if (src[j] === q) {
            if (src[j + 1] === q) { out += q; j += 2; continue; }
            break;
          }
          out += src[j++];
        }
        row.push(unescape(out));
        i = j + 1;
      } else {
        let j = i;
        while (j < n && src[j] !== "," && src[j] !== ")") j++;
        const raw = src.slice(i, j).trim();
        if (/^null$/i.test(raw)) row.push(null);
        else if (/^0x[0-9a-f]*$/i.test(raw)) row.push(Buffer.from(raw.slice(2), "hex").toString("utf8"));
        else if (/^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(raw)) row.push(Number(raw));
        else row.push(raw);
        i = j;
      }
      skipWs();
      if (src[i] === ",") { i++; continue; }
      if (src[i] === ")") { i++; break; }
      throw new Error(`Unexpected "${src.slice(i, i + 30)}" while reading values`);
    }
    rows.push(row);
  }
  return rows;
}

const unquote = (name) => name.trim().replace(/^`|`$/g, "");

/** Column names from a CREATE TABLE body, in order. */
function createColumns(stmt) {
  const body = stmt.slice(stmt.indexOf("(") + 1, stmt.lastIndexOf(")"));
  // Split on commas outside brackets and quotes: decimal(5,2) and enum('a','b') stay whole
  const parts = [];
  let depth = 0, quote = null, from = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (quote) { if (c === "\\") i++; else if (c === quote) quote = null; continue; }
    if (c === "'" || c === '"') quote = c;
    else if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (c === "," && depth === 0) { parts.push(body.slice(from, i)); from = i + 1; }
  }
  parts.push(body.slice(from));
  const cols = [];
  for (const part of parts) {
    const m = /^\s*`([^`]+)`\s+/.exec(part);
    if (m) cols.push(m[1]);
  }
  return cols;
}

/**
 * @param {string} sql
 * @param {{ only?: Set<string> }} [opts] only read the rows of these tables; others are listed in `skipped`
 *   with their size in bytes, without parsing (the old site's `emails` log alone is ~400 MB)
 */
export function parseDump(sql, { only } = {}) {
  const columns = new Map();
  const tables = new Map();
  const skipped = new Map();
  for (const stmt of statements(sql)) {
    const create = /^CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(`[^`]+`|\w+)/i.exec(stmt);
    if (create) {
      columns.set(unquote(create[1]), createColumns(stmt));
      continue;
    }
    const ins = /^(?:INSERT|REPLACE)\s+(?:IGNORE\s+)?INTO\s+(`[^`]+`|\w+)\s*(\(([^)]*)\))?\s*VALUES\s*/i.exec(stmt);
    if (!ins) continue;
    const table = unquote(ins[1]);
    if (only && !only.has(table)) {
      skipped.set(table, (skipped.get(table) ?? 0) + stmt.length);
      continue;
    }
    const cols = ins[3] ? ins[3].split(",").map(unquote) : columns.get(table);
    if (!cols) throw new Error(`No column list for table "${table}": the export needs its CREATE TABLE statements.`);
    const list = tables.get(table) ?? [];
    for (const values of parseValues(stmt.slice(ins[0].length))) {
      if (values.length !== cols.length) throw new Error(`Table "${table}": a row has ${values.length} values but ${cols.length} columns.`);
      list.push(Object.fromEntries(cols.map((c, k) => [c, values[k]])));
    }
    tables.set(table, list);
  }
  for (const t of columns.keys()) if (!tables.has(t) && !(only && !only.has(t))) tables.set(t, []);
  if (only) Object.defineProperty(tables, "skipped", { value: skipped });
  return tables;
}
