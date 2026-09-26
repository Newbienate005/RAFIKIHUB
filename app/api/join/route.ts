import { handleForm } from "@/lib/api";
import { joinSchema } from "@/lib/validation";
import { members } from "@/lib/db/schema";

export async function POST(req: Request) {
  return handleForm(req, joinSchema, (db, d) =>
    db.insert(members).values({ ...d, plan: d.plan || null, location: d.location || null, message: d.message || null }),
  );
}
