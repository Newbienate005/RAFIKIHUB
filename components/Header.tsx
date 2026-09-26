import Link from "next/link";
import { isGroup, navLeft, navRight, type NavItem } from "@/lib/site";
import { Logo } from "./Logo";
import { MobileDrawer } from "./MobileDrawer";
import { NavDropdown } from "./NavDropdown";

function NavList({ items }: { items: NavItem[] }) {
  return (
    <ul>
      {items.map((n) => (
        <li key={n.label}>{isGroup(n) ? <NavDropdown group={n} /> : <Link href={n.href}>{n.label}</Link>}</li>
      ))}
    </ul>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <a className="skip" href="#main">Skip to content</a>
      <div className="wrap site-header__inner">
        <div className="site-header__side">
          <nav aria-label="Main" className="nav-desktop"><NavList items={navLeft} /></nav>
          <div className="nav-mobile"><MobileDrawer /></div>
        </div>

        <Link href="/" className="brand" aria-label="RafikiHub home">
          <Logo />
        </Link>

        <div className="site-header__side site-header__side--end">
          <nav aria-label="Resources" className="nav-desktop"><NavList items={navRight} /></nav>
          <Link href="/join" className="btn btn--sun btn--sm">Join Now</Link>
        </div>
      </div>
      <div className="beadband" aria-hidden="true" />
    </header>
  );
}
