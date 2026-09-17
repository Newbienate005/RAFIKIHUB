import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import type { Theme } from '../theme'
import { testimonials, blogPosts, timeline, countries } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

// Section order mirrors the real rafikihub.com homepage (index.php): hero →
// Our Services → Happy Members → Kick-off your career → Brands & Companies →
// Latest News → Companies & Affiliates. "RafikiHub — Our Journey" (a condensed
// teaser of the full About page timeline) was added after Our Services per
// user request, so the milestones are visible without navigating away.
//
// IDENTITY PASS: this page was the flagship "generic corporate SaaS" example
// (centered hero, uniform 3-card grids everywhere) — it's had the deepest
// bespoke rework in the editorial/arts-magazine redesign: an off-center
// masthead-style hero, a numbered rule-list instead of a service card grid,
// a single oversized pull-quote instead of three equal testimonial cards,
// an edge-to-edge bleeding photo instead of a boxed image, and a featured-
// story-plus-briefs news layout instead of three equal blog cards.
const services = [
  { title: 'Performers', body: 'Be seen by the industry & apply for professional work.', page: 'talent' as Page },
  { title: 'Casting Professionals', body: 'Access a vast database of performers & use us to cast your projects with fluidity & ease.', page: 'talent' as Page },
  { title: 'Crew', body: 'Express yourself, boost your portfolio & build industry contacts.', page: 'talent' as Page },
]

const brands = ['Kenya Film Commission', 'Multichoice Talent Factory', 'Nairobi Fashion Hub', 'Sio Bahati Studios', 'Africa Uncut Media', 'Baraza Media Lab']

function Eyebrow({ children, color }: { children: ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span style={{ width: 32, height: 1, background: color, display: 'inline-block' }} />
      <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color, fontFamily: 'var(--font-sans)' }}>{children}</span>
    </div>
  )
}

// PRODUCTION-READINESS PASS: the real rafikihub.com puts a live "Create New
// Account" quick-start form directly in the hero — on every page, not just
// the homepage — because it's the site's actual primary conversion
// mechanic (no click needed to start signing up). The editorial redesign's
// hero had dropped that in favor of a single CTA button. This panel brings
// the real capture mechanic back, restyled to match the new identity
// (flat offset shadow, rounded-md, Fraunces label), and hands whatever the
// visitor typed straight into the full Create Account form on "Next Step".
function QuickStartPanel({ t, navigate }: { t: Theme; navigate: (page: Page, data?: unknown) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')

  const fieldStyle = { background: t.inputBg, border: `1px solid ${t.border}`, color: t.fg, fontFamily: 'var(--font-sans)' }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const [firstName, ...rest] = name.trim().split(/\s+/)
    navigate('register', {
      firstName: firstName || '',
      lastName: rest.join(' '),
      email,
      // country/phone/gender aren't fields on the full form yet — kept here
      // so they're not silently thrown away once that form grows to match.
      country,
      phone,
      gender,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md p-6 md:p-8 space-y-4"
      style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: '5px 5px 0 rgba(0,0,0,0.35)' }}
    >
      <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>Create New Account</h2>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Your Name</label>
        <input required className="w-full px-4 py-3 rounded-md text-sm" style={fieldStyle} placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Your Email</label>
        <input required type="email" className="w-full px-4 py-3 rounded-md text-sm" style={fieldStyle} placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Country</label>
          <select required className="w-full px-4 py-3 rounded-md text-sm" style={fieldStyle} value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="" disabled>Select</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Phone</label>
          <input className="w-full px-4 py-3 rounded-md text-sm" style={fieldStyle} placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Gender</label>
        <select required className="w-full px-4 py-3 rounded-md text-sm" style={fieldStyle} value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="" disabled>Select Option</option>
          <option>Female</option>
          <option>Male</option>
          <option>Prefer not to say</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-[1.02]"
        style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
      >
        Next Step →
      </button>
    </form>
  )
}

export default function HomePage({ navigate }: Props) {
  const { t } = useTheme()
  const latestPosts = blogPosts.slice(0, 3)
  // Happy Members revolves through every testimonial automatically, and can
  // also be jumped to a specific one via the dots underneath.
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [quoteVisible, setQuoteVisible] = useState(true)
  const activeQuote = testimonials[quoteIndex]

  useEffect(() => {
    if (testimonials.length <= 1) return
    const id = setInterval(() => {
      setQuoteVisible(false)
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % testimonials.length)
        setQuoteVisible(true)
      }, 300)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  function goToQuote(i: number) {
    if (i === quoteIndex) return
    setQuoteVisible(false)
    setTimeout(() => {
      setQuoteIndex(i)
      setQuoteVisible(true)
    }, 300)
  }

  return (
    <div style={{ background: t.bg }}>
      {/* HERO — masthead-style, headline anchored bottom-left rather than
          centered, closer to a magazine cover than a SaaS landing hero. */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden" style={{ background: '#1A1816' }}>
        <img
          src="https://picsum.photos/seed/rafikihub-hero/1920/1080"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,24,22,0.35) 0%, rgba(20,18,16,0.75) 65%, rgba(20,18,16,0.97) 100%)' }} />
        <div className="relative px-6 md:px-16 lg:px-24 pt-32 pb-24 md:pb-28 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-end">
            <div className="lg:col-span-7">
              <Eyebrow color={t.terra}>Africa's Performing Arts Community</Eyebrow>
              <h1 className="mb-10 leading-[0.98]" style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF', fontSize: 'clamp(2.75rem, 7vw, 6.5rem)', fontWeight: 600, maxWidth: '15ch' }}>
                Building <em style={{ fontStyle: 'italic', color: t.terra }}>Africa's</em> creative future
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => navigate('dashboard')}
                  className="px-8 py-4 rounded-md font-semibold text-base transition-colors duration-150"
                  style={{ border: '1px solid rgba(255,255,255,0.4)', color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
                >
                  Sign In to Get Started
                </button>
                <button
                  onClick={() => navigate('about')}
                  className="px-8 py-4 rounded-md font-semibold text-base transition-colors duration-150"
                  style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-sans)' }}
                >
                  What We Do →
                </button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <QuickStartPanel t={t} navigate={navigate} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-70">
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>Scroll</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke="#FFFFFF" strokeWidth="1.2" />
            <circle cx="7" cy="6" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
        {/* Beadwork stripe bookends the hero, echoing the one under the nav. */}
        <div className="absolute bottom-0 left-0 right-0 rh-beadband" style={{ height: 3 }} aria-hidden="true" />
      </section>

      {/* OUR SERVICES — a numbered editorial list in place of the uniform
          three-card grid, with an intro column set apart to one side. */}
      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow color={t.terra}>What We Offer</Eyebrow>
            <h2 className="mb-6 text-4xl md:text-5xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>Our Services</h2>
            <p className="text-base leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
              Three ways in — whichever seat you sit in at the table.
            </p>
          </div>
          <div className="lg:col-span-8">
            {services.map((s, i) => (
              <button
                key={s.title}
                onClick={() => navigate(s.page)}
                className="w-full text-left flex items-start gap-6 md:gap-10 py-8 border-t last:border-b group"
                style={{ borderColor: t.border }}
              >
                <span className="text-3xl md:text-4xl font-bold flex-shrink-0 w-14 md:w-16" style={{ fontFamily: 'var(--font-display)', color: t.terra }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 transition-transform duration-150 group-hover:translate-x-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{s.title}</h3>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{s.body}</p>
                </div>
                <span aria-hidden="true" className="hidden md:block text-2xl flex-shrink-0 mt-1" style={{ color: t.terra }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RAFIKIHUB — OUR JOURNEY (condensed teaser — full story on About) —
          a rule-topped timeline strip rather than four equal boxed cards. */}
      <section className="py-28 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 max-w-xl">
            <Eyebrow color={t.terra}>Our Story</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>RafikiHub — Our Journey</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 mb-12">
            {timeline.map((item, i) => (
              <div key={item.id} className="pt-6" style={{ borderTop: `2px solid ${i === timeline.length - 1 ? t.terra : t.border}` }}>
                <span className="block text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: t.terra }}>{item.year}</span>
                <span className="block text-sm font-semibold leading-snug" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{item.title}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('about')} className="text-sm font-semibold underline underline-offset-4" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
            Read our full story →
          </button>
        </div>
      </section>

      {/* HAPPY MEMBERS — a single oversized pull-quote that revolves through
          every testimonial on a timer (with dots to jump manually), instead
          of a static grid of equal-weight cards. */}
      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <Eyebrow color={t.terra}>Happy Members</Eyebrow>
          <div style={{ opacity: quoteVisible ? 1 : 0, transition: 'opacity 300ms ease' }}>
            <blockquote
              className="mb-10"
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 500, color: t.fg, fontSize: 'clamp(1.75rem, 4.2vw, 3.25rem)', lineHeight: 1.25, maxWidth: '26ch', minHeight: '6.5rem' }}
            >
              "{activeQuote.quote}"
            </blockquote>
            <div className="flex items-center gap-4 mb-10">
              <img src={activeQuote.photo} alt={activeQuote.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" style={{ background: t.border }} />
              <div>
                <div className="font-semibold text-base" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{activeQuote.name}</div>
                <div className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{activeQuote.role} · {activeQuote.location}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {testimonials.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToQuote(i)}
                aria-label={`Show testimonial from ${s.name}`}
                aria-current={i === quoteIndex}
                className="transition-all duration-300"
                style={{ width: i === quoteIndex ? 28 : 8, height: 8, borderRadius: 999, background: i === quoteIndex ? t.terra : t.border, flexShrink: 0 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* KICK-OFF YOUR CAREER — the photo now bleeds edge-to-edge instead
          of sitting in a padded rounded-rectangle container. */}
      <section className="relative" style={{ background: t.bg2 }}>
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-2 items-stretch">
          <div className="relative overflow-hidden order-2 md:order-1" style={{ minHeight: 360, background: t.muted }}>
            <img
              src="https://picsum.photos/seed/rafikihub-career/900/1100"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2 py-20 px-6 md:px-16 flex flex-col justify-center">
            <Eyebrow color={t.terra}>Get Noticed</Eyebrow>
            <h2 className="mb-6 text-4xl md:text-5xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>
              Kick-off your career in performing arts
            </h2>
            {/* Real verbatim copy from rafikihub.com's index.php. */}
            <p className="text-base leading-relaxed mb-8" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
              RafikiHub is the Industry's leading Casting platform, designed to bring the Industry together. Our mission: To create a platform that forms easy links between artists and industry professionals whilst boosting the showcase of Kenyan/East African/African artistic talent. If you are serious about a career in the Arts, RafikiHub is your golden ticket to achieving your career goals and ambitions. Choose from our membership options to take you further in your Performing Arts career.
            </p>
            <button
              onClick={() => navigate('join')}
              className="self-start px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
              style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
            >
              Find Out More
            </button>
          </div>
        </div>
      </section>

      {/* BRANDS & COMPANIES */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Brands</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>Brands &amp; Companies</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brands.map((b) => (
              <span key={b} className="text-sm font-semibold tracking-wide text-center" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS — a featured lead story beside a rail of smaller
          briefs, instead of three equal blog cards; images crop sharp
          rather than sitting in rounded-rectangle frames. */}
      <section className="py-28 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex items-end justify-between flex-wrap gap-6">
            <div className="text-left">
              <Eyebrow color={t.terra}>News</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>Latest News</h2>
            </div>
            <button onClick={() => navigate('blog')} className="text-sm font-semibold underline underline-offset-4" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
              View all posts →
            </button>
          </div>
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            <button onClick={() => navigate('blog-article', latestPosts[0])} className="lg:col-span-2 text-left group flex flex-col">
              <div className="relative overflow-hidden mb-6" style={{ paddingBottom: '52%', background: t.muted }}>
                <img src={latestPosts[0].image} alt={latestPosts[0].title} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
              </div>
              <span className="text-xs uppercase tracking-wide mb-2" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{latestPosts[0].date}</span>
              <h3 className="text-2xl md:text-3xl font-semibold mb-3 leading-snug" style={{ color: t.fg, fontFamily: 'var(--font-display)' }}>{latestPosts[0].title}</h3>
              <p className="text-base leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{latestPosts[0].excerpt}</p>
            </button>
            <div className="flex flex-col gap-8 lg:border-l lg:pl-10" style={{ borderColor: t.border }}>
              {latestPosts.slice(1).map((p) => (
                <button key={p.id} onClick={() => navigate('blog-article', p)} className="text-left group flex gap-4 pb-8 border-b last:border-b-0 last:pb-0" style={{ borderColor: t.border }}>
                  <div className="relative overflow-hidden flex-shrink-0" style={{ width: 96, height: 96, background: t.muted }}>
                    <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide mb-1 block" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{p.date}</span>
                    <h3 className="text-base font-semibold leading-snug" style={{ color: t.fg, fontFamily: 'var(--font-display)' }}>{p.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPANIES & AFFILIATES */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="mb-10 text-4xl md:text-5xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>Companies &amp; Affiliates</h2>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brands.slice().reverse().map((b) => (
              <span key={b} className="text-sm font-semibold tracking-wide" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="py-28 px-6 md:px-16 lg:px-24" style={{ background: t.gold }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF', fontSize: 'clamp(2.25rem, 5vw, 4.5rem)' }}>
            Ready to join RafikiHub?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#B9C2CE', fontFamily: 'var(--font-sans)' }}>
            Choose a membership option and become part of Africa's centre of excellence for the performing arts.
          </p>
          <button
            onClick={() => navigate('join')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
          >
            Join Now
          </button>
        </div>
      </section>
    </div>
  )
}
