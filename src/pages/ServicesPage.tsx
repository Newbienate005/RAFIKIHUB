import type { Page } from '../App'
import { useTheme } from '../theme'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

const services = [
  {
    number: '01',
    title: 'Talent Management',
    body: 'Full-service representation for performers and crew — contracts, bookings, and career guidance from agents who know the regional market.',
    page: 'talent' as Page,
    cta: 'Browse talent',
  },
  {
    number: '02',
    title: 'Casting & Auditions',
    body: 'A direct line between casting professionals and performers — post a call, get matched, and manage submissions in one place.',
    page: 'join' as Page,
    cta: 'Get started',
  },
  {
    number: '03',
    title: 'Knowledge Circles',
    body: 'Peer-learning pods organised by craft and region, pairing emerging talent with mentors across the diaspora.',
    page: 'blog' as Page,
    cta: 'Read the stories',
  },
  {
    number: '04',
    title: 'Ubuntu Grants',
    body: 'Community-funded micro-grants for creators and performers, with no application gatekeeping and fast turnaround.',
    page: 'options' as Page,
    cta: 'See membership options',
  },
  {
    number: '05',
    title: 'Young Performers Programme',
    body: 'A safeguarded pathway for performers under 18, with guardian verification and dedicated casting review.',
    page: 'faq' as Page,
    cta: 'Read our safeguards',
  },
]

export default function ServicesPage({ navigate }: Props) {
  const { t } = useTheme()

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Sio Bahati</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Why are we <em style={{ color: t.terra, fontStyle: 'italic' }}>here</em>?
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            From representation to casting, everything a performing artist needs to build a sustainable career, in one hub.
          </p>
        </div>
      </section>

      {/* Real verbatim quote and essay from rafikihub.com's services.php —
          this is what the real "Why are we here?" section actually says. */}
      <section className="py-20 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-3xl mx-auto">
          <blockquote className="mb-10">
            <p
              className="mb-3"
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 500, color: t.fg, fontSize: 'clamp(1.35rem, 3vw, 2rem)', lineHeight: 1.4 }}
            >
              “I say, luck is when an opportunity comes along and you're prepared for it!”
            </p>
            <footer className="text-sm font-semibold uppercase tracking-wide" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
              — Denzel Washington
            </footer>
          </blockquote>
          <p className="text-base leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            So you wanna be an Actor...? Who doesn't? Acting is an exciting career path to take, but it can be a hard and challenging road ahead. Acting isn't all about feeling the character and being in the moment. If you can't get a job, it's not about much at all. Not to mention lonely, with a lot of rejection to be dealt with. A lot of people underestimate the types of obstacles every actor encounters and therefore think that acting is...well, a walk in the park. I'm here to set the record straight and give you an insight into what it really takes to be an Actor. An astonishing 92% of the Acting profession are out of work at any one time. What the figure doesn't reveal is that the same 8% tend to work continuously while the same 92% never get a look-in. The trick therefore is to be in the top 8%. This can be difficult as an upcoming Actor, (especially in a slowly emerging Industry like our very own here in Kenya) because you may not have the right tools to set you above from the rest...yet! That is why we're here!
          </p>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.number} className="rounded-2xl p-8 md:p-10 flex flex-col justify-between" style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)', minHeight: 260 }}>
              <div>
                <span className="block text-4xl font-bold leading-none mb-6" style={{ fontFamily: 'var(--font-display)', color: t.border }}>{s.number}</span>
                <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{s.body}</p>
              </div>
              <button
                onClick={() => navigate(s.page)}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold self-start"
                style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}
              >
                {s.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24" style={{ background: t.terra }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#FFFFFFaa', fontFamily: 'var(--font-sans)' }}>Not sure where to start?</span>
          <h2 className="mt-4 mb-8 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
            Talk to our team.
          </h2>
          <button
            onClick={() => navigate('contacts')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: '#FFFFFF', color: t.terra, fontFamily: 'var(--font-sans)' }}
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  )
}
