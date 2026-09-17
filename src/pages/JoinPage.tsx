import type { Page } from '../App'
import { useTheme } from '../theme'
import { plans } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

// "How RafikiHub Works" benefits and eligibility pathways below are inspired
// by spotlight.com's performer membership page (icon-based benefit grid +
// a plain-language eligibility breakdown), adapted to RafikiHub's own
// features and community programmes.
const benefits = [
  {
    title: 'Talent Scout',
    body: 'Opt in and verified agents can discover your profile and reach out directly — no agent required to start.',
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Wellbeing Support',
    body: 'Free access to mental health and wellbeing resources through our Ubuntu Grants partner network.',
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 20s-7-4.4-9.5-9C1 7.5 2.5 4 6 4c2 0 3.5 1.2 4 2 0.5-0.8 2-2 4-2 3.5 0 5 3.5 3.5 7-2.5 4.6-9.5 9-9.5 9Z" />
      </svg>
    ),
  },
  {
    title: 'Heritage & Skills Search',
    body: 'Casting professionals can filter by skill, language, and heritage — helping the right roles find you.',
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <line x1="20" y1="20" x2="15.3" y2="15.3" />
      </svg>
    ),
  },
  {
    title: 'Self-Tape Sharing',
    body: 'Upload, manage, and share audition self-tapes directly from your RafikiHub profile.',
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="2" y="5" width="14" height="14" rx="2" />
        <path d="M16 9.5 22 6v12l-6-3.5" />
      </svg>
    ),
  },
  {
    title: 'Community Events',
    body: 'Free member access to Knowledge Circles, workshops, and live sessions with working artists.',
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <line x1="3" y1="9.5" x2="21" y2="9.5" />
        <line x1="7.5" y1="2.5" x2="7.5" y2="6.5" />
        <line x1="16.5" y1="2.5" x2="16.5" y2="6.5" />
      </svg>
    ),
  },
  {
    title: 'Partner Discounts',
    body: 'Preferential rates on travel, insurance, and studio time from RafikiHub\'s partner network.',
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
  },
]

const eligibility = [
  { title: 'Experience', body: 'One paid performance credit, or a booking made through RafikiHub or a partner organisation.' },
  { title: 'Training', body: 'Completed a recognised performing-arts training programme — school, conservatoire, or a certified online course.' },
  { title: 'Recommendation', body: 'Endorsed by an existing verified member, a registered agent, or a partner organisation.' },
]

export default function JoinPage({ navigate }: Props) {
  const { t } = useTheme()

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Membership</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Find your <em style={{ color: t.terra, fontStyle: 'italic' }}>rafiki</em>.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            Join 180,000 members across 54 countries. Free to start, upgrade any time.
          </p>
        </div>
      </section>

      {/* How RafikiHub Works */}
      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Member Benefits</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>How RafikiHub works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-xl p-7" style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5" style={{ background: t.g10 }}>
                  {b.icon(t.terra)}
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl p-8 flex flex-col"
              style={{
                background: p.highlighted ? t.terra : t.card,
                border: `1px solid ${p.highlighted ? t.terra : t.border}`,
                transform: p.highlighted ? 'scale(1.03)' : 'none',
              }}
            >
              {p.highlighted && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 self-start" style={{ background: '#FFFFFF', color: t.terra }}>
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: p.highlighted ? '#FFFFFF' : t.fg }}>{p.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: p.highlighted ? '#FFFFFF' : t.fg }}>
                  {p.price === 0 ? 'Free' : `$${p.price}`}
                </span>
                {p.price > 0 && <span className="text-sm" style={{ color: p.highlighted ? '#FFFFFFaa' : t.mutedFg }}> /{p.period}</span>}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: p.highlighted ? '#FFFFFFdd' : t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                    <span style={{ color: p.highlighted ? '#FFFFFF' : t.terra }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('register')}
                className="w-full py-3 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-[1.02]"
                style={{
                  background: p.highlighted ? '#FFFFFF' : t.terra,
                  color: p.highlighted ? t.terra : '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {p.price === 0 ? 'Join Free' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
          Want the full feature comparison?{' '}
          <button onClick={() => navigate('options')} className="font-semibold underline" style={{ color: t.terra }}>See membership options</button>
        </p>
      </section>

      {/* Who Can Join — eligibility pathways */}
      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Who Can Join</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>
              Three ways to <em style={{ color: t.terra, fontStyle: 'italic' }}>qualify</em>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
              You only need to meet one of the paths below as a Performer, Agent, Crew, or Casting Professional member.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {eligibility.map((e, i) => (
              <div key={e.title} className="rounded-xl p-8" style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }}>
                <span className="block text-3xl font-bold leading-none mb-5" style={{ fontFamily: 'var(--font-display)', color: t.border }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{e.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{e.body}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            Not sure which applies to you?{' '}
            <button onClick={() => navigate('faq')} className="font-semibold underline" style={{ color: t.terra }}>Check the FAQ</button>
            {' '}or{' '}
            <button onClick={() => navigate('contacts')} className="font-semibold underline" style={{ color: t.terra }}>get in touch</button>.
          </p>
        </div>
      </section>
    </div>
  )
}
