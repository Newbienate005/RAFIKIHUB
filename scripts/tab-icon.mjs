// Regenerates the browser-tab icon (app/icon.png) from scripts/tab-icon.svg: `node scripts/tab-icon.mjs`
// shortcut: sharp comes in through next, not package.json; add it as a devDependency if next ever drops it.
import sharp from "sharp";

await sharp("scripts/tab-icon.svg", { density: 72 }).resize(64, 64).png().toFile("app/icon.png");
