import { handleForm } from "@/lib/api";
import { locationRequests } from "@/lib/db/schema";
import { locationRequestSchema } from "@/lib/validation";

export async function POST(req: Request) {
  return handleForm(req, locationRequestSchema, (db, d) =>
    db.insert(locationRequests).values({
      ...d,
      country: d.country || null,
      phone: d.phone || null,
      crew: d.crew || null,
      fromDate: d.fromDate || null,
      toDate: d.toDate || null,
      services: d.services || null,
      details: d.details || null,
    }),
  );
}
