import type { MediaClip, TalentProfile } from "./data";

/** Every showreel, oldest first. Profiles saved before multiple reels existed only have showreelUrl. */
export const reelsOf = (p: TalentProfile): MediaClip[] =>
  p.media.reels?.length ? p.media.reels : p.media.showreelUrl ? [{ url: p.media.showreelUrl, title: null }] : [];

/** Every voice clip, oldest first. */
export const voiceClipsOf = (p: TalentProfile): MediaClip[] =>
  p.media.voiceClips?.length ? p.media.voiceClips : p.media.voiceoverReelUrl ? [{ url: p.media.voiceoverReelUrl, title: null }] : [];

/** Where a photo, reel or clip lives: brought over from the old site, uploaded on this one, or a pasted link. */
export function mediaOrigin(url: string): "old-site" | "uploaded" | "link" {
  if (/^https:\/\/(www\.)?rafikihub\.com\/assets\//.test(url) || /\.public\.blob\.vercel-storage\.com\/legacy\//.test(url)) return "old-site";
  if (/\.public\.blob\.vercel-storage\.com\//.test(url)) return "uploaded";
  return "link";
}
export const originLabel = { "old-site": "From your old profile", uploaded: "Uploaded", link: "Link" } as const;

export type ClipKind =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "video"; playable: boolean }
  | { kind: "audio"; playable: boolean }
  | { kind: "link" };

/** How to show a clip. AVI, WMV, FLV and 3GP files from the old site don't play in browsers, so they're offered as downloads. */
export function clipKind(url: string): ClipKind {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "youtube", id: yt[1] };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "vimeo", id: vimeo[1] };
  const ext = url.split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase() ?? "";
  if (["mp4", "m4v", "webm", "mov", "ogv"].includes(ext)) return { kind: "video", playable: true };
  if (["avi", "wmv", "flv", "3gp", "mkv", "mpg", "mpeg"].includes(ext)) return { kind: "video", playable: false };
  if (["mp3", "m4a", "aac", "wav", "ogg", "oga", "opus"].includes(ext)) return { kind: "audio", playable: true };
  if (["wma", "amr", "aiff", "aif"].includes(ext)) return { kind: "audio", playable: false };
  return { kind: "link" };
}
