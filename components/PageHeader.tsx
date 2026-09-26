import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

type Props = { title: React.ReactNode; lead: string; crumbs: { name: string; path: string }[]; kicker?: string };

export function PageHeader({ title, lead, crumbs, kicker }: Props) {
  return (
    <header className="page-header pattern">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="crumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            {crumbs.map((c, i) => (
              <li key={c.path}>
                {i === crumbs.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.path}>{c.name}</Link>}
              </li>
            ))}
          </ol>
        </nav>
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
      </div>
    </header>
  );
}
