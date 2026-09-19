import { useState, type FormEvent } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { fullCountryList, intendedLocationOptions, blogPosts } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

// LOCATIONS — real locations.php is a B2B lead-generation form for
// productions wanting to scout filming locations in Kenya via RafikiHub's
// travel-partner network. There is no city gallery or member count on the
// real page (those were invented); replaced with the real scouting-request
// form fields below.
export default function LocationsPage({ navigate }: Props) {
  const { t } = useTheme()
  const [sent, setSent] = useState(false)
  const [services, setServices] = useState<string[]>([])
  const [serviceInput, setServiceInput] = useState('')

  const inputStyle = { background: t.inputBg, border: `1px solid ${t.border}`, color: t.fg, fontFamily: 'var(--font-sans)' }
  const cardStyle = { background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }

  const addService = () => {
    const v = serviceInput.trim()
    if (v && !services.includes(v)) setServices([...services, v])
    setServiceInput('')
  }
  const removeService = (v: string) => setServices(services.filter((s) => s !== v))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const recentPosts = blogPosts.slice(0, 3)

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>RafikiHub Locations</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Scout <em style={{ color: t.terra, fontStyle: 'italic' }}>Kenya</em> for your next production.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            RafikiHub connects productions with Kenya's landscapes, cities and venues through our network of vetted local travel and logistics partners. Whether you need a coastline, a savannah, a studio, or an office block for a shoot, tell us what you're looking for and our partner network will get back to you with options. This is a location-scouting enquiry, not a membership sign-up.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 rounded-2xl p-8 md:p-10" style={cardStyle}>
            {sent ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: t.terra }}>Request received!</h3>
                <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Thanks — we'll be in touch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Organization</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="Production company name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Email Address</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="you@production.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Country</label>
                    <select required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} defaultValue="">
                      <option value="" disabled>Select a country</option>
                      {fullCountryList.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Phone Number</label>
                    <input required type="tel" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="+1 234 567 8901" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Nature of Project/Production</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="Feature film, documentary, commercial, etc." />
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>No. of Persons on Set (Cast &amp; Crew)</label>
                    <input required type="number" min={1} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="e.g. 25" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Date From</label>
                    <input required type="date" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Date To</label>
                    <input required type="date" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Intended Location</label>
                  <select required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} defaultValue="">
                    <option value="" disabled>Select a location type</option>
                    {intendedLocationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Services Required</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addService() } }}
                      className="flex-1 px-4 py-3 rounded-lg text-sm"
                      style={inputStyle}
                      placeholder="e.g. Catering, Transport, Security"
                    />
                    <button
                      type="button"
                      onClick={addService}
                      className="px-5 py-3 rounded-lg text-sm font-semibold flex-shrink-0"
                      style={{ background: t.g15, color: t.terra, fontFamily: 'var(--font-sans)' }}
                    >
                      ADD
                    </button>
                  </div>
                  {services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {services.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                          style={{ background: t.g10, color: t.fg, border: `1px solid ${t.border}`, fontFamily: 'var(--font-sans)' }}
                        >
                          {s}
                          <button type="button" onClick={() => removeService(s)} aria-label={`Remove ${s}`} style={{ color: t.terra }}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>More Information</label>
                  <textarea rows={5} className="w-full px-4 py-3 rounded-lg text-sm resize-none" style={inputStyle} placeholder="Tell us more about your shoot and location needs." />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-[1.02]"
                  style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
                >
                  SUBMIT REQUEST
                </button>
              </form>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>From the Blog</h3>
            <div className="space-y-4">
              {recentPosts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate('blog-article', p)}
                  className="w-full text-left rounded-lg p-4"
                  style={cardStyle}
                >
                  <div className="text-xs font-medium mb-1" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>{p.category}</div>
                  <div className="text-sm font-semibold leading-snug" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{p.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
