/** A safe Blob file name from an uploaded file's name: "My Headshot (1).JPG" → "my-headshot-1.jpg" */
export function uploadName(name: string, fallback: string, defaultExt = "") {
  const base = name.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || fallback;
  const ext = name.match(/\.[a-z0-9]+$/i)?.[0].toLowerCase() ?? defaultExt;
  return base + ext;
}
