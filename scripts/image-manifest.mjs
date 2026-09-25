// Lists every image in /public/images so <Photo> knows which files exist.
// Runs automatically before `npm run dev` and `npm run build`.
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public");
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);
const found = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (exts.has(path.extname(entry.name).toLowerCase())) {
      found.push("/" + path.relative(root, full).split(path.sep).join("/"));
    }
  }
}
walk(path.join(root, "images"));
fs.writeFileSync(path.join(process.cwd(), "lib", "image-manifest.json"), JSON.stringify(found.sort(), null, 2));
console.log(`[images] ${found.length} image(s) available`);
