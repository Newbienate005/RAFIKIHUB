import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import manifest from "@/lib/image-manifest.json";

const available = new Set<string>(manifest as string[]);

type Props = {
  title: React.ReactNode;
  lead: string;
  crumbs: { name: string; path: string }[];
  kicker?: string;
  /** A banner photo, faded into the dark behind the title (decorative). Skipped if the file isn't there. */
  image?: string;
};

export function PageHeader({ title, lead, crumbs, kicker, image }: Props) {
  const photo = image && available.has(image) ? image : null;
  return (
    <header className={photo ? "page-header page-header--photo pattern" : "page-header pattern"}>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      {photo ? (
        <div className="page-header__photo" aria-hidden="true">
          <Image src={photo} alt="" fill priority sizes="(max-width: 760px) 100vw, 60vw" />
        </div>
      ) : null}
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
