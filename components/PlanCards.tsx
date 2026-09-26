import Link from "next/link";
import { membershipIncludes, perMonth, plans, savingVsBasic } from "@/lib/data";

const ksh = (n: number) => `Ksh ${n.toLocaleString("en-KE")}`;

export function PlanCards() {
  return (
    <div className="plans">
      {plans.map((p) => (
        <article key={p.id} className={`plan${p.highlighted ? " plan--best" : ""}`}>
          {p.highlighted ? <span className="plan__badge">Best</span> : null}
          <h3>{p.name}</h3>
          <p className="plan__price">{ksh(p.priceKsh)} <span>{p.label}</span></p>
          <p className="plan__note">
            {p.months > 1 ? <>About {ksh(perMonth(p))} a month. Save {ksh(savingVsBasic(p))}.</> : <>Pay month by month.</>}
          </p>
          <ul>{membershipIncludes.slice(0, 3).map((f) => <li key={f}>{f}</li>)}</ul>
          <Link className={`btn ${p.highlighted ? "btn--sun" : "btn--ink"}`} href={`/join?plan=${p.id}#join-form`}>Choose {p.name}</Link>
        </article>
      ))}
    </div>
  );
}
