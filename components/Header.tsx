import Link from "next/link";
import { nav } from "@/lib/site";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="site-header">
      <a className="skip" href="#main">Skip to content</a>
      <div className="wrap site-header__inner">
        <Link href="/" className="brand" aria-label="RafikiHub home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="nav-desktop">
          <ul>
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          <Link href="/contact" className="btn btn--ghost btn--sm">Contact</Link>
          <Link href="/join" className="btn btn--sun btn--sm">Join now</Link>
        </div>
        <details className="nav-mobile">
          <summary aria-label="Open menu"><span /><span /><span /></summary>
          <nav aria-label="Mobile">
            <ul>
              {nav.map((n) => (
                <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
              ))}
              <li><Link href="/team">Our team</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
