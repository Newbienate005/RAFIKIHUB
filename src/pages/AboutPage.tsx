import type { ReactNode } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { team, timeline, timelineClosing } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

const values = [
  { title: 'Ubuntu First', body: 'We build for reciprocity, not extraction. Every feature starts with the question: does this help someone else in the community too?' },
  { title: 'Continent & Diaspora', body: 'RafikiHub was never just for people on the continent, or just for the diaspora. It is the bridge between the two.' },
  { title: 'No Gatekeepers', body: 'Opportunity should not depend on who you already know. Our castings, funding, and mentorship are open by default.' },
  { title: 'Built to Last', body: 'We are a community-owned platform, not a growth-at-all-costs startup. Slow, steady, and accountable to our members.' },
]

// Real copy, verbatim from rafikihub.com's about-us.php.
const whatWeDo =
  "RafikiHub serves as a central platform for the performing arts, focused on fostering talent by providing educational and career development tools, while linking performers with opportunities in theatre, television, and film. We empower performers to showcase their abilities via dynamic profiles on our innovative platform, reaching a global network of casting directors and project creators. Our goal is to support talent discovery and contribute to the ongoing vitality of stages and screens around Africa and beyond."

const whoWeAre =
  "“RafikiHubbers” represent a diverse and passionate community, all united by a love for the creative arts. There’s nothing more rewarding than watching one of our members land their first job, seeing our youngest members secure their first audition, or celebrating a long-time member receiving an award. These moments are what drive us. With a deep understanding of the industry, we use our expertise to support and guide our members. We're fuelled by the desire to bring people together and constantly seek new ways to help our community connect and thrive."

const whoWeCollaborateWith =
  "We partner with incredible organizations that are truly making an impact in the performing arts. Some have been part of the industry as long as we have, while others are newer to the scene. Regardless of their journey, we take pride in working together with all of them to help shape and grow the industry."

// IDENTITY PASS: the flagship "corporate template" example alongside the
// Homepage — every section here used to be an eyebrow label + heading +
// uniform card grid. Reworked into a rule-line eyebrow, a numbered stat
// list instead of four boxed tiles, and a values list with oversized
// display-serif initials instead of four identical value cards.
function Eyebrow({ children, color }: { children: ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span style={{ width: 32, height: 1, background: color, display: 'inline-block' }} />
      <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color, fontFamily: 'var(--font-sans)' }}>{children}</span>
    </div>
  )
}

export default function AboutPage({ navigate }: Props) {
  const { t } = useTheme()

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-24 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span style={{ width: 32, height: 1, background: t.terra, display: 'inline-block' }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>About Us</span>
            <span style={{ width: 32, height: 1, background: t.terra, display: 'inline-block' }} />
          </div>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            What <em style={{ color: t.terra, fontStyle: 'italic' }}>We Do</em>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            {whatWeDo}
          </p>
        </div>
      </section>

      {/* WHO WE ARE — real verbatim copy from about-us.php, single column
          (the previous version paired this with a grid of invented stat
          claims; those numbers had no basis in the real codebase, so this
          section is now just the real paragraph). */}
      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color={t.terra}>Who We Are</Eyebrow>
          <h2 className="mb-6 text-4xl md:text-5xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>
            RafikiHubbers.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            {whoWeAre}
          </p>
        </div>
      </section>

      {/* WHO WE COLLABORATE WITH — real verbatim copy, its own section
          (previously this eyebrow label was misapplied to the invented
          "values" list below). */}
      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-3xl mx-auto">
          <Eyebrow color={t.terra}>Who We Collaborate With</Eyebrow>
          <h2 className="mb-6 text-3xl md:text-4xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>
            Partners in the work.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            {whoWeCollaborateWith}
          </p>
        </div>
      </section>

      {/* OUR VALUES — an oversized display-serif initial in place of the
          four uniform card boxes. Editorial brand-voice content (not a
          factual claim), kept from the earlier identity pass but now
          correctly labelled as our own values rather than borrowing the
          real site's "Who We Collaborate With" heading. */}
      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-xl">
            <Eyebrow color={t.terra}>Our Values</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>What we stand for</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
            {values.map((v) => (
              <div key={v.title} className="flex gap-6">
                <span className="flex-shrink-0 leading-none select-none" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600, fontSize: '3.5rem', color: t.terra, opacity: 0.5 }}>
                  {v.title.charAt(0)}
                </span>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14 text-center">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <span style={{ width: 32, height: 1, background: t.terra, display: 'inline-block' }} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Our Story</span>
              <span style={{ width: 32, height: 1, background: t.terra, display: 'inline-block' }} />
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>RafikiHub — Our Journey</h2>
          </div>
          <div className="space-y-14">
            {timeline.map((item) => (
              <div key={item.id} className="flex gap-6 md:gap-10 pb-14 border-b last:border-b-0" style={{ borderColor: t.border }}>
                <span className="text-2xl font-bold w-20 flex-shrink-0" style={{ fontFamily: 'var(--font-display)', color: t.terra }}>{item.year}</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: t.fg, fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                  <p className="text-sm font-semibold mb-3" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>{item.tagline}</p>
                  {item.body.map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 500, color: t.fg, fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', lineHeight: 1.4 }}>
              {timelineClosing}
            </p>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex items-end justify-between flex-wrap gap-6">
            <div>
              <Eyebrow color={t.terra}>Leadership</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>Meet the team</h2>
            </div>
            <button onClick={() => navigate('team')} className="text-sm font-semibold underline underline-offset-4" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
              View full team →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {team.slice(0, 6).map((m) => (
              <div key={m.id} className="text-center">
                <div className="relative overflow-hidden rounded-full mb-3 mx-auto" style={{ width: 96, height: 96, background: t.muted }}>
                  <img src={m.photo} alt={m.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <h3 className="text-sm font-semibold" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{m.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT CAN I EXPECT WHEN I JOIN RAFIKIHUB — real verbatim copy plus
          the real published contact number/email from util-prod.php. */}
      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span style={{ width: 32, height: 1, background: t.terra, display: 'inline-block' }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Joining Up</span>
            <span style={{ width: 32, height: 1, background: t.terra, display: 'inline-block' }} />
          </div>
          <h2 className="mb-6 text-3xl md:text-4xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>
            What can I expect when I join RafikiHub?
          </h2>
          <p className="text-base leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            We are always here to help. Find out more about what to expect from your membership here, or if you have any questions just ask us by calling{' '}
            <a href="tel:+254114011932" className="font-semibold underline" style={{ color: t.terra }}>+254 (0) 114 011 932</a>
            {' '}or emailing{' '}
            <a href="mailto:info@rafikihub.com" className="font-semibold underline" style={{ color: t.terra }}>info@rafikihub.com</a>.
          </p>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24" style={{ background: t.terra }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
            Come build it with us.
          </h2>
          <button
            onClick={() => navigate('join')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: '#FFFFFF', color: t.terra, fontFamily: 'var(--font-sans)' }}
          >
            Join the Hub
          </button>
        </div>
      </section>
    </div>
  )
}
