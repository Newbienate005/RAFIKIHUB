import { handleForm } from "@/lib/api";
import { castingSchema } from "@/lib/validation";
import { castingCalls } from "@/lib/db/schema";

export async function POST(req: Request) {
  return handleForm(
    req,
    castingSchema,
    (db, d) =>
      db.insert(castingCalls).values({
        ...d,
        phone: d.phone || null,
        shootDates: d.shootDates || null,
        location: d.location || null,
      }),
    (d) => ({
      redirect: "/dashboard/casting?welcome=1",
      session: { kind: "member", role: "casting", name: d.contactName, email: d.email, company: d.company, project: `${d.projectTitle} (${d.projectType})`, location: d.location || undefined },
    }),
  );
}
