import { handleForm } from "@/lib/api";
import { newsletterSchema } from "@/lib/validation";
import { newsletterSubscribers } from "@/lib/db/schema";

export async function POST(req: Request) {
  return handleForm(req, newsletterSchema, (db, d) =>
    db.insert(newsletterSubscribers).values({ email: d.email.toLowerCase() }).onConflictDoNothing(),
  );
}
