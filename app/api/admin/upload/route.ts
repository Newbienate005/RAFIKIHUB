import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { getSession } from "@/lib/session";

/** A reason the upload was turned down, safe to show the person */
class UploadRefused extends Error {}

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
  const body = (await req.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) return NextResponse.json({ error: "That upload request wasn't readable. Try again." }, { status: 400 });
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const s = await getSession();
        const top = pathname.split("/")[0] as keyof typeof kinds;
        if (!Object.hasOwn(kinds, top) || pathname.includes("..")) throw new UploadRefused("Unexpected upload path.");
        if (s?.kind === "master") {
          // The admin can upload anywhere under these folders
        } else if (s?.kind === "member" && s.accountId) {
          // Members upload their own photos, reels and voice clips, and only into their own folder
          if (top === "documents" || !pathname.startsWith(`${top}/members/${s.accountId}/`)) throw new UploadRefused("You can only upload to your own profile.");
          // getSession already turns away blocked accounts; check again here as uploads cost storage
          const [a] = await getDb()?.select({ status: accounts.status }).from(accounts).where(eq(accounts.id, s.accountId)).limit(1) ?? [];
          if (!a || a.status === "blocked") throw new UploadRefused("This account can't upload. Email info@rafikihub.com.");
        } else throw new UploadRefused("Sign in to upload.");
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
    // Our own refusals are safe to show; anything else stays in the logs
    if (e instanceof UploadRefused) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("[upload] failed", e);
    return NextResponse.json({ error: "The upload service didn't respond. Try again in a minute." }, { status: 502 });
  }
}
