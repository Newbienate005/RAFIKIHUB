import { useState } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { membershipCards, type MembershipCard } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

const slugify = (option: string) => option.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// Shared between JoinPage (join-now.php) and OptionsPage (options.php) — on
// the real site these are the same 8-membership-card grid, differing only in
// heading copy and whether the visitor is logged out (Join Now -> register)
// or logged in (Go to Dashboard -> dashboard). There is no pricing anywhere
// on either real page — membership options are described by their bullet
// copy alone.
export function MembershipCardsGrid({ navigate, loggedIn }: Props & { loggedIn: boolean }) {
  const { t } = useTheme()
  const [openCard, setOpenCard] = useState<MembershipCard | null>(null)

  const cardStyle = { background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }

  const handleCta = () => {
    navigate(loggedIn ? 'dashboard' : 'register')
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {membershipCards.map((c) => (
          <div key={c.option} className="rounded-2xl overflow-hidden flex flex-col" style={cardStyle}>
            <img
              src={`https://picsum.photos/seed/rh-${slugify(c.option)}/600/400`}
              alt={c.option}
              className="w-full h-40 object-cover"
            />
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{c.option}</h3>
              <ul className="space-y-2 mb-5 flex-1">
                {c.bullets.slice(0, 2).map((b) => (
                  <li key={b} className="text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{b}</li>
                ))}
              </ul>
              <div className="flex items-center gap-3 mt-auto">
                <button
                  type="button"
                  onClick={() => setOpenCard(c)}
                  className="text-xs font-semibold uppercase tracking-wide underline"
                  style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}
                >
                  Read More
                </button>
                <button
                  type="button"
                  onClick={handleCta}
                  className="ml-auto px-5 py-2.5 rounded-md text-sm font-semibold transition-transform duration-150 hover:scale-[1.02]"
                  style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
                >
                  {loggedIn ? 'Go to Dashboard' : 'Join Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={() => setOpenCard(null)}
        >
          <div
            className="rounded-2xl p-8 md:p-10 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            style={cardStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{openCard.option}</h3>
              <button type="button" onClick={() => setOpenCard(null)} className="text-sm shrink-0" style={{ color: t.mutedFg }}>Close</button>
            </div>
            <ul className="space-y-3 mb-2">
              {openCard.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                  <span style={{ color: t.terra }}>&#10003;</span>
                  {b}
                </li>
              ))}
            </ul>
            {openCard.criteria && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
                  Criteria for listing your space
                </h4>
                <ul className="space-y-2">
                  {openCard.criteria.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                      <span style={{ color: t.terra }}>&#8226;</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              type="button"
              onClick={() => { setOpenCard(null); handleCta() }}
              className="w-full mt-8 py-3 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-[1.02]"
              style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
            >
              {loggedIn ? 'Go to Dashboard' : 'Join Now'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default function JoinPage({ navigate }: Props) {
  const { t } = useTheme()

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Join Us</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Find your <em style={{ color: t.terra, fontStyle: 'italic' }}>rafiki</em>.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            Choose the membership option that fits you, and create your free RafikiHub account.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <MembershipCardsGrid navigate={navigate} loggedIn={false} />
        </div>
      </section>
    </div>
  )
}
