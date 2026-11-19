import { seeOther } from "@/lib/app-url";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  const res = seeOther("/");
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
