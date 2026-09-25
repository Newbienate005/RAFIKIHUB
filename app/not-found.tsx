import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap measure">
        <h1>This page has left the stage</h1>
        <p className="lead">The link may be old or mistyped. Try one of these instead.</p>
        <div className="btn-row">
          <Link className="btn btn--ink" href="/">Go to the home page</Link>
          <Link className="btn btn--ghost" href="/join">Join as talent</Link>
        </div>
      </div>
    </section>
  );
}
