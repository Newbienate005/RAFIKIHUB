import Link from "next/link";

type Action = { href: string; label: string };
export function CtaBand({ kicker, title, text, primary, secondary }: { kicker?: string; title: string; text?: string; primary: Action; secondary?: Action }) {
  return (
    <section className="section band">
      <div className="wrap">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h2>{title}</h2>
        {text ? <p>{text}</p> : null}
        <div className="btn-row">
          <Link href={primary.href} className="btn btn--sun">{primary.label}</Link>
          {secondary ? <Link href={secondary.href} className="btn btn--ghost">{secondary.label}</Link> : null}
        </div>
      </div>
    </section>
  );
}
