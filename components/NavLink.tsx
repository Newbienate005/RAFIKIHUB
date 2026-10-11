"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** A header link that marks itself as the current page ("Where am I?"), including pages below it. */
export function NavLink({ href, children, className, prefetch }: { href: string; children: React.ReactNode; className?: string; prefetch?: boolean }) {
  const path = usePathname();
  const current = href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
  return <Link href={href} className={className} prefetch={prefetch} aria-current={current ? "page" : undefined}>{children}</Link>;
}
