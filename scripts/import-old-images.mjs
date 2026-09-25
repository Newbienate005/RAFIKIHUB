// Downloads every image used on the old rafikihub.com into /public/images/legacy.
// Usage:  npm run images:import
// Then open public/images/legacy/index.html to see them all with their file names,
// and assign the ones you want in lib/images.ts.
import fs from "node:fs";
import path from "node:path";

const ORIGIN = "https://rafikihub.com";
const PAGES = [
  "/", "/about-us", "/join-now", "/team", "/faq", "/blog", "/services",
  "/talent-management", "/contact-us", "/profile?url=katesnow",
  "/article?url=lucy-maina---rafikihub-member--talent",
];
const OUT = path.join(process.cwd(), "public", "images", "legacy");
const IMG_EXT = /\.(jpe?g|png|webp|gif|svg|avif)(\?.*)?$/i;

fs.mkdirSync(OUT, { recursive: true });

const seenPages = new Set();
const imageUrls = new Map(); // url -> alt text

function abs(u, base) {
  try { return new URL(u, base).href; } catch { return null; }
}

async function crawl(pagePath, depth = 0) {
  const url = abs(pagePath, ORIGIN);
  if (!url || seenPages.has(url) || seenPages.size > 60) return;
  seenPages.add(url);
  let html;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "RafikiHub site migration" } });
    if (!res.ok) return console.log(`  skip ${url} (${res.status})`);
    html = await res.text();
  } catch (e) {
    return console.log(`  skip ${url} (${e.message})`);
  }
  console.log(`page ${url}`);

  // <img src>, srcset, data-src
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const alt = (tag.match(/alt=["']([^"']*)["']/i) || [])[1] || "";
    for (const attr of ["src", "data-src", "data-lazy-src"]) {
      const v = (tag.match(new RegExp(`${attr}=["']([^"']+)["']`, "i")) || [])[1];
      if (v && !v.startsWith("data:")) imageUrls.set(abs(v, url), alt);
    }
    const srcset = (tag.match(/srcset=["']([^"']+)["']/i) || [])[1];
    if (srcset) srcset.split(",").forEach((s) => imageUrls.set(abs(s.trim().split(" ")[0], url), alt));
  }
  // CSS backgrounds and og:image
  for (const m of html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) {
    if (IMG_EXT.test(m[1])) imageUrls.set(abs(m[1], url), "");
  }
  for (const m of html.matchAll(/<meta[^>]+content=["']([^"']+\.(?:jpe?g|png|webp))["']/gi)) {
    imageUrls.set(abs(m[1], url), "og");
  }
  // follow internal links one level deep (profiles, articles)
  if (depth < 1) {
    for (const m of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
      const link = abs(m[1], url);
      if (link && link.startsWith(ORIGIN) && !IMG_EXT.test(link) && !/\.(css|js|pdf)(\?|$)/i.test(link)) {
        await crawl(link, depth + 1);
      }
    }
  }
}

function fileNameFor(u, alt) {
  const p = new URL(u);
  let base = path.basename(p.pathname).replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  if (!IMG_EXT.test(base)) base += ".jpg";
  if (alt && alt !== "og" && alt.length < 60) {
    const slug = alt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (slug) base = `${slug}-${base}`;
  }
  return base;
}

for (const p of PAGES) await crawl(p);

const saved = [];
for (const [u, alt] of imageUrls) {
  if (!u || !u.startsWith("http")) continue;
  const name = fileNameFor(u, alt);
  const dest = path.join(OUT, name);
  if (fs.existsSync(dest)) { saved.push({ name, u, alt }); continue; }
  try {
    const res = await fetch(u);
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1500) continue; // skip tracking pixels / tiny icons
    fs.writeFileSync(dest, buf);
    saved.push({ name, u, alt });
    console.log(`  saved ${name}`);
  } catch {}
}

const gallery = `<!doctype html><meta charset="utf-8"><title>Old RafikiHub images</title>
<style>body{font:14px system-ui;margin:24px;background:#f4f4f8}div{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
figure{margin:0;background:#fff;padding:8px;border-radius:6px}img{width:100%;height:180px;object-fit:cover;background:#ddd}
code{font-size:12px;word-break:break-all}</style>
<h1>${saved.length} images from rafikihub.com</h1><p>Copy a path into <code>lib/images.ts</code>.</p><div>
${saved.map((s) => `<figure><img src="${s.name}" alt=""><figcaption><code>/images/legacy/${s.name}</code><br>${s.alt || ""}</figcaption></figure>`).join("\n")}
</div>`;
fs.writeFileSync(path.join(OUT, "index.html"), gallery);
console.log(`\nDone: ${saved.length} images in public/images/legacy. Open public/images/legacy/index.html to browse.`);
