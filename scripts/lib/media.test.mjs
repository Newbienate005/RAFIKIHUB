// node --test scripts/lib/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { clipKind, mediaOrigin, reelsOf, voiceClipsOf } from "../../lib/media.ts";

test("media is labelled by where it lives", () => {
  assert.equal(mediaOrigin("https://rafikihub.com/assets/videos/1616085069137.mp4"), "old-site");
  assert.equal(mediaOrigin("https://abc.public.blob.vercel-storage.com/legacy/videos/1.mp4"), "old-site", "old files copied to Blob still count as the old site's");
  assert.equal(mediaOrigin("https://abc.public.blob.vercel-storage.com/videos/members/4/reel-x1.mp4"), "uploaded");
  assert.equal(mediaOrigin("https://youtu.be/dQw4w9WgXcQ"), "link");
});

test("clips play the right way, and old formats browsers can't play become downloads", () => {
  assert.deepEqual(clipKind("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=3"), { kind: "youtube", id: "dQw4w9WgXcQ" });
  assert.deepEqual(clipKind("https://youtu.be/dQw4w9WgXcQ"), { kind: "youtube", id: "dQw4w9WgXcQ" });
  assert.deepEqual(clipKind("https://vimeo.com/123456"), { kind: "vimeo", id: "123456" });
  assert.deepEqual(clipKind("https://rafikihub.com/assets/videos/1620845540163.MOV"), { kind: "video", playable: true });
  assert.deepEqual(clipKind("https://rafikihub.com/assets/videos/162064139291.avi"), { kind: "video", playable: false });
  assert.deepEqual(clipKind("https://rafikihub.com/assets/voices/1617701165153.mp3"), { kind: "audio", playable: true });
  assert.deepEqual(clipKind("https://example.com/my-reel"), { kind: "link" });
});

test("profiles saved before lists of reels existed still show their one reel", () => {
  const media = { headshots: [], showreelUrl: "https://x.test/a.mp4", voiceoverReelUrl: null, documents: [] };
  assert.deepEqual(reelsOf({ media }), [{ url: "https://x.test/a.mp4", title: null }]);
  assert.deepEqual(voiceClipsOf({ media }), []);
  const reels = [{ url: "https://x.test/b.mp4", title: "B" }];
  assert.deepEqual(reelsOf({ media: { ...media, reels } }), reels);
});
