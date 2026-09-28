// Copies the old rafikihub.com images (downloaded by `npm run images:import`) into the
// slots the new site uses, resized and compressed for the web.
// Usage:  npm run images:import && node scripts/place-legacy-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "public", "images", "legacy");
const PUB = path.join(process.cwd(), "public");

// [old-site file, new path, max width, format]
const photos = [
  // Testimonial avatars (old home page "Happy Members")
  ["16497547361112.png", "/images/people/amani-mwasera.jpg", 400],
  ["17074794011599.png", "/images/people/lucy-maina.jpg", 900],
  ["168664496610186.png", "/images/people/sam-wachira.jpg", 900],
  ["1751097834184.png", "/images/people/brenda-ngeso.jpg", 900],
  ["1729443290965.png", "/images/people/mirell-nazi.jpg", 900],
  ["1627838667801.png", "/images/people/olivia-makena-makau.jpg", 400],
  ["1651483731132.png", "/images/people/bob-zenga.jpg", 400],
  ["1751475134379.png", "/images/people/seda-nigel.jpg", 900],
  ["16903013591529.png", "/images/people/derrick-kinyanjui.jpg", 900],
  // Blog covers (old article thumbnails, matched by date)
  ["171146011991.png", "/images/blog/lucy-maina.jpg", 1200],
  ["17084197761.png", "/images/blog/homage-to-the-film-actor.jpg", 1400],
  ["172593225091.png", "/images/blog/lwanda-otero.jpg", 1400],
  ["kate-snow-171087633291.png", "/images/blog/acting-headshot.jpg", 1200],
  ["casting.jpeg", "/images/blog/how-casting-works.jpg", 1400],
  // Sections and pages
  ["52.jpg", "/images/sections/workshop.jpg", 1400],
  ["performer.jpeg", "/images/sections/performers.jpg", 1400],
  ["casting.jpeg", "/images/sections/casting.jpg", 1400],
  ["171395272991.png", "/images/sections/community.jpg", 1400],
  ["location.jpg", "/images/sections/nairobi.jpg", 1400],
  // Sio Bahati Services
  ["kate-snow-171087605191.png", "/images/services/headshots.jpg", 1000],
  ["bahati.jpg", "/images/services/showreels.jpg", 1200],
  ["17084197761.png", "/images/services/audition-prep.jpg", 1200],
];

// Partner logos (old home page "Brands & Companies" and "Companies & Affiliates"), kept as PNG
const logos = [
  ["16347070531.png", "/images/partners/maumau-arts.png"],
  ["16347092861.png", "/images/partners/national-youth-theatre-kenya.png"],
  ["16887986701.png", "/images/partners/greenlight-films.png"],
  ["16887989581.png", "/images/partners/redflash-films.png"],
  ["16741502801.png", "/images/partners/amitations-studio.png"],
  ["16741503971.png", "/images/partners/triggerfish.png"],
  ["167697320391.png", "/images/partners/some-fine-day-pix.png"],
  ["16775104921.png", "/images/partners/backdrop.png"],
  ["16781876411.png", "/images/partners/filamu-festival.png"],
  ["176487291191.png", "/images/partners/affc.png"],
];

let n = 0;
for (const [from, to, width] of photos) {
  const src = path.join(SRC, from);
  if (!fs.existsSync(src)) { console.log(`  missing ${from}`); continue; }
  const dest = path.join(PUB, to);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(src).resize({ width, withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 80, mozjpeg: true }).toFile(dest);
  n++;
}
for (const [from, to] of logos) {
  const src = path.join(SRC, from);
  if (!fs.existsSync(src)) { console.log(`  missing ${from}`); continue; }
  const dest = path.join(PUB, to);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(src).resize({ height: 160, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }).toFile(dest);
  n++;
}
console.log(`Placed ${n} images.`);
