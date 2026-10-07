import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/**
 * Image uploads from the admin go straight from the browser to Vercel Blob. This route only hands
 * out a short-lived upload token, and only to someone signed in with the master login.
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
        if ((await getSession())?.kind !== "master") throw new Error("Sign in to the admin to upload.");
        if (!/^(images|documents)\//.test(pathname)) throw new Error("Unexpected upload path.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
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
