import { useState, type ReactNode } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

// TALENT MANAGEMENT — real talent-management.php is a static, single-column
// sales pitch for RafikiHub's own in-house talent agency service, aimed at
// performers seeking representation. There is no talent grid or filtering
// on the real page (that was invented); replaced with the real sections.
const representationPoints = [
  'Contracting talent for suitable roles and opportunities.',
  'Ensuring contracts are in place before any work begins.',
  'Reviewing agreements on the performer’s behalf.',
  'Ensuring contractual obligations from production crews are met.',
  'Seeking out work opportunities on the performer’s behalf.',
]

const whatYouGet = [
  'Discount on services.',
  'Personalised career advice.',
  'Featured displays on our pages.',
]

const additionalPerks = [
  'Get professionally edited headshots.',
  'Showreels: sneak peek high-quality footage.',
  'Audition preparation: exclusive industry advice and help with audition pieces.',
]

function Eyebrow({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span style={{ width: 32, height: 1, background: color, display: 'inline-block' }} />
      <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color, fontFamily: 'var(--font-sans)' }}>{children}</span>
    </div>
  )
}

export default function TalentManagementPage({ navigate }: Props) {
  const { t } = useTheme()
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Talent Management</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.5rem, 6vw, 4.75rem)' }}>
            Are you an Artist seeking <em style={{ color: t.terra, fontStyle: 'italic' }}>agent representation</em>?
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            RafikiHub Talent Management is looking for YOU! We represent actors across Radio, Theatre, Commercials, Film and TV. Get in touch at{' '}
            <a href="mailto:talent@rafikihub.com" className="font-semibold underline" style={{ color: t.terra }}>talent@rafikihub.com</a>.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full text-left rounded-xl p-6 md:p-8"
            style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>
                When we talk about representation, RafikiHub Talent Management means:
              </h2>
              <span
                className="flex-shrink-0 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-md"
                style={{ background: t.g15, color: t.terra, fontFamily: 'var(--font-sans)' }}
              >
                {expanded ? 'Show Less' : 'Read More'}
              </span>
            </div>
            {expanded && (
              <ul className="mt-6 space-y-3">
                {representationPoints.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                    <span style={{ color: t.terra }}>—</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}
          </button>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-3xl mx-auto">
          <Eyebrow color={t.terra}>Who We Are</Eyebrow>
          <h2 className="mb-6 text-3xl md:text-4xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>
            An in-house agency, built around our own community.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            RafikiHub Talent Management is the in-house agency arm of RafikiHub, working directly alongside the casting professionals, producers and corporates already active on the platform. Because we sit inside the same network our members are discovered through, we're able to advocate for our represented artists with a direct line into the opportunities that matter, rather than acting as an outside intermediary.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color={t.terra}>Who Can Apply</Eyebrow>
          <h2 className="mb-4 text-3xl md:text-4xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>
            Only performers without an agency or representation can apply.
          </h2>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <Eyebrow color={t.terra}>What Do You Get</Eyebrow>
            <ul className="space-y-3 mt-2">
              {whatYouGet.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                  <span style={{ color: t.terra }}>—</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow color={t.terra}>Additional</Eyebrow>
            <ul className="space-y-3 mt-2">
              {additionalPerks.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                  <span style={{ color: t.terra }}>—</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24" style={{ background: t.terra }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF', fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Ready to apply for representation?
          </h2>
          <p className="text-base mb-8" style={{ color: '#FFFFFFcc', fontFamily: 'var(--font-sans)' }}>
            Email us at talent@rafikihub.com, or reach out through our contacts listing.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:talent@rafikihub.com"
              className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
              style={{ background: '#FFFFFF', color: t.terra, fontFamily: 'var(--font-sans)' }}
            >
              Email Talent Management
            </a>
            <button
              onClick={() => navigate('contacts')}
              className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
              style={{ background: 'transparent', color: '#FFFFFF', border: '1px solid #FFFFFF', fontFamily: 'var(--font-sans)' }}
            >
              Visit Contacts Listing
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
