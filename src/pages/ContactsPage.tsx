import { useState, type FormEvent } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { locations } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

export default function ContactsPage({ navigate }: Props) {
  const { t } = useTheme()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const inputStyle = {
    background: t.inputBg,
    border: `1px solid ${t.border}`,
    color: t.fg,
    fontFamily: 'var(--font-sans)',
  }

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Rafiki Data Bank</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Contacts <em style={{ color: t.terra, fontStyle: 'italic' }}>Listing</em>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            Questions about membership, partnerships, or press? Our team usually replies within one business day.
          </p>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          <div className="rounded-2xl p-8 md:p-10" style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }}>
            {sent ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: t.terra }}>Message sent!</h3>
                <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Thank you — we'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Full Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="Amara Diallo" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Email</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Subject</label>
                  <select className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle}>
                    <option>General inquiry</option>
                    <option>Membership</option>
                    <option>Partnerships</option>
                    <option>Press</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Message</label>
                  <textarea required rows={5} className="w-full px-4 py-3 rounded-lg text-sm resize-none" style={inputStyle} placeholder="How can we help?" />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-[1.02]"
                  style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Our Cities</h3>
            <div className="space-y-4 mb-10">
              {locations.slice(0, 4).map((l) => (
                <button
                  key={l.id}
                  onClick={() => navigate('locations')}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-lg text-left"
                  style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }}
                >
                  <div>
                    <div className="font-semibold text-sm" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{l.city}</div>
                    <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{l.country}</div>
                  </div>
                  <span className="text-xs font-medium" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>{l.memberCount.toLocaleString()} members</span>
                </button>
              ))}
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Direct</h3>
            <p className="text-sm mb-1" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>info@rafikihub.com</p>
            <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>+254 (0) 114 011 932</p>
          </div>
        </div>
      </section>
    </div>
  )
}
