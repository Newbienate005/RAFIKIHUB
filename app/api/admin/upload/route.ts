import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/** What each top-level folder accepts */
const kinds = {
  images: { types: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"], mb: 10 },
  documents: { types: ["application/pdf", "image/jpeg", "image/png"], mb: 10 },
  videos: { types: ["video/mp4", "video/webm", "video/quicktime"], mb: 150 },
  voices: { types: ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/x-wav", "audio/aac", "audio/ogg"], mb: 100 },
} as const;

/**
 * Photo, showreel and voice clip uploads go straight from the browser to Vercel Blob. This route only hands
 * out a short-lived upload token: to the master login, or to a signed-in member for their own folder.
 * Needs BLOB_READ_WRITE_TOKEN (Vercel → Storage → Blob).
 */
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Uploads aren't set up yet: add BLOB_READ_WRITE_TOKEN. You can paste an image link instead." }, { status: 503 });
  }
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const s = await getSession();
        const top = pathname.split("/")[0] as keyof typeof kinds;
        if (!Object.hasOwn(kinds, top) || pathname.includes("..")) throw new Error("Unexpected upload path.");
        if (s?.kind === "master") {
          // The admin can upload anywhere under these folders
        } else if (s?.kind === "member" && s.accountId) {
          // Members upload their own photos, reels and voice clips, and only into their own folder
          if (top === "documents" || !pathname.startsWith(`${top}/members/${s.accountId}/`)) throw new Error("You can only upload to your own profile.");
        } else throw new Error("Sign in to upload.");
        return {
          allowedContentTypes: [...kinds[top].types],
          maximumSizeInBytes: kinds[top].mb * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      // Nothing to record: the form saves the returned URL itself
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
