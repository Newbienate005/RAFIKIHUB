import { handleForm } from "@/lib/api";
import { roleForCategory } from "@/lib/dashboard";
import { joinSchema } from "@/lib/validation";
import { members } from "@/lib/db/schema";

export async function POST(req: Request) {
  return handleForm(
    req,
    joinSchema,
    (db, d) => db.insert(members).values({ ...d, plan: d.plan || null, location: d.location || null, message: d.message || null }),
    // Signs the new member in and opens the dashboard that matches what they joined as
    (d) => {
      const role = roleForCategory(d.category);
      return {
        redirect: `/dashboard/${role}?welcome=1`,
        session: { kind: "member", role, name: d.fullName, email: d.email, category: d.category, plan: d.plan || undefined, location: d.location || undefined },
      };
    },
  );
}
