import type { Page } from '../App'
import { useTheme } from '../theme'
import { privacyBlocks, type LegalBlock } from '../privacyData'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

// Renders the real Privacy Policy text extracted from rafikihub.com's
// privacy-policy.php, including the separate Marketing Privacy Policy
// sub-section.
function LegalBody({ blocks }: { blocks: LegalBlock[] }) {
  const { t } = useTheme()
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'heading' && b.level === 2) {
          return (
            <h2
              key={i}
              className="mt-16 mb-6 pt-8 border-t first:mt-0 first:pt-0 first:border-0 font-semibold"
              style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(1.5rem, 3vw, 2rem)', borderColor: t.border }}
            >
              {b.text}
            </h2>
          )
        }
        if (b.type === 'heading' && b.level === 4) {
          return (
            <h3
              key={i}
              className="mt-8 mb-3 text-base font-semibold"
              style={{ fontFamily: 'var(--font-sans)', color: t.fg }}
            >
              {b.text}
            </h3>
          )
        }
        if (b.type === 'heading') {
          return (
            <h4
              key={i}
              className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-sans)', color: t.terra }}
            >
              {b.text}
            </h4>
          )
        }
        if (b.type === 'list') {
          return (
            <ul key={i} className="list-disc pl-5 space-y-2 mb-4">
              {(b.items ?? []).map((item, j) => (
                <li key={j} className="text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                  {item}
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            {b.text}
          </p>
        )
      })}
    </>
  )
}

export default function PrivacyPage({ navigate }: Props) {
  const { t } = useTheme()

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Legal</span>
          <h1 className="mt-4 mb-4 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>
            RafikiHub, trading as Sio Bahati Holdings Ltd.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <LegalBody blocks={privacyBlocks} />
        </div>
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t text-center" style={{ borderColor: t.border }}>
          <button onClick={() => navigate('terms')} className="text-sm font-semibold underline underline-offset-4" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
            Read our Terms & Conditions →
          </button>
        </div>
      </section>
    </div>
  )
}
