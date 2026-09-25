import { handleForm } from "@/lib/api";
import { contactSchema } from "@/lib/validation";
import { contactMessages } from "@/lib/db/schema";

export async function POST(req: Request) {
  return handleForm(req, contactSchema, (db, d) => db.insert(contactMessages).values(d));
}
