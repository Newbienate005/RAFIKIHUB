import type { Page } from '../App'
import { useTheme } from '../theme'
import { MembershipCardsGrid } from './JoinPage'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

// options.php on the real site is the logged-in variant of join-now.php —
// same 8 membership-option cards, same copy, no pricing anywhere. The only
// difference is the heading/breadcrumb text and each card's CTA, which here
// sends an already-registered visitor straight to their dashboard instead
// of the register form.
export default function OptionsPage({ navigate }: Props) {
  const { t } = useTheme()

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Options</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Your membership <em style={{ color: t.terra, fontStyle: 'italic' }}>options</em>.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            Manage or switch your membership option at any time from your dashboard.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <MembershipCardsGrid navigate={navigate} loggedIn={true} />
        </div>
      </section>
    </div>
  )
}
