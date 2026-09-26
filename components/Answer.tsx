/** An answer-first summary right under the page header: the direct answer search and AI engines quote. */
export function Answer({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <section className="section--tight section--white" aria-labelledby="answer">
      <div className="wrap answer">
        <h2 id="answer">{question}</h2>
        <p>{children}</p>
      </div>
    </section>
  );
}
