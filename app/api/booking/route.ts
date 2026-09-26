import { handleForm } from "@/lib/api";
import { bookingSchema } from "@/lib/validation";
import { serviceBookings } from "@/lib/db/schema";

export async function POST(req: Request) {
  return handleForm(req, bookingSchema, (db, d) =>
    db.insert(serviceBookings).values({ ...d, preferredDate: d.preferredDate || null, notes: d.notes || null }),
  );
}
