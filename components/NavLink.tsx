"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** A header link that marks itself as the current page ("Where am I?"), including pages below it. */
export function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const path = usePathname();
  const current = href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
  return <Link href={href} className={className} aria-current={current ? "page" : undefined}>{children}</Link>;
}
