import type { Page } from '../App'
import { useTheme } from '../theme'
import { plans } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

const compareRows = [
  { label: 'Public profile page', keys: [true, true, true, true] },
  { label: 'Browse castings', keys: [true, true, true, true] },
  { label: 'Join Knowledge Circles', keys: [true, true, true, true] },
  { label: 'Priority casting alerts', keys: [false, true, true, true] },
  { label: 'Verified badge', keys: [false, true, true, true] },
  { label: 'Manage multiple talent profiles', keys: [false, false, true, true] },
  { label: 'Bulk casting submissions', keys: [false, false, true, true] },
  { label: 'Sponsorship placement', keys: [false, false, false, true] },
  { label: 'Dedicated account manager', keys: [false, false, false, true] },
]

export default function OptionsPage({ navigate }: Props) {
  const { t } = useTheme()

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Account Options</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Compare <em style={{ color: t.terra, fontStyle: 'italic' }}>every</em> plan.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            A full feature-by-feature breakdown, so you know exactly what you're choosing.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24 overflow-x-auto">
        <div className="max-w-6xl mx-auto min-w-[720px]">
          <div className="grid grid-cols-5 gap-px rounded-xl overflow-hidden" style={{ background: t.border }}>
            <div className="p-5" style={{ background: t.bg }} />
            {plans.map((p) => (
              <div key={p.id} className="p-5 text-center" style={{ background: p.highlighted ? t.terra : t.card }}>
                <div className="text-sm font-semibold" style={{ color: p.highlighted ? '#FFFFFF' : t.fg, fontFamily: 'var(--font-sans)' }}>{p.name}</div>
                <div className="text-xs mt-1" style={{ color: p.highlighted ? '#FFFFFFaa' : t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                  {p.price === 0 ? 'Free' : `$${p.price}/${p.period}`}
                </div>
              </div>
            ))}

            {compareRows.map((row) => (
              <>
                <div key={row.label} className="p-5 flex items-center" style={{ background: t.bg }}>
                  <span className="text-sm" style={{ color: t.fgDim, fontFamily: 'var(--font-sans)' }}>{row.label}</span>
                </div>
                {row.keys.map((v, i) => (
                  <div key={`${row.label}-${i}`} className="p-5 flex items-center justify-center" style={{ background: t.card }}>
                    <span style={{ color: v ? t.terra : t.subtle }}>{v ? '✓' : '—'}</span>
                  </div>
                ))}
              </>
            ))}

            <div className="p-5" style={{ background: t.bg }} />
            {plans.map((p) => (
              <div key={`${p.id}-cta`} className="p-5 text-center" style={{ background: p.highlighted ? t.terra : t.card }}>
                <button
                  onClick={() => navigate('register')}
                  className="px-5 py-2 rounded-md text-xs font-semibold"
                  style={{
                    background: p.highlighted ? '#FFFFFF' : t.terra,
                    color: p.highlighted ? t.terra : '#FFFFFF',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Choose
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.terra }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF', fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Still deciding?
          </h2>
          <button
            onClick={() => navigate('join')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: '#FFFFFF', color: t.terra, fontFamily: 'var(--font-sans)' }}
          >
            Back to Simple Pricing
          </button>
        </div>
      </section>
    </div>
  )
}
