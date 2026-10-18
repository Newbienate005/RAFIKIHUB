/**
 * Where profile photos may come from. Must match images.remotePatterns in next.config.mjs:
 * a photo from anywhere else can't go through next/image and shows as a broken picture.
 */
export function isAllowedImageUrl(src: string) {
  let u: URL;
  try {
    u = new URL(src);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  if (u.hostname.endsWith(".public.blob.vercel-storage.com")) return true;
  return (u.hostname === "rafikihub.com" || u.hostname === "www.rafikihub.com") && u.pathname.startsWith("/assets/");
}
