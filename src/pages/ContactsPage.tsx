import { useState, type FormEvent } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { contactDirectory, fullCountryList, genderOptions } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

// CONTACTS — real contacts.php is titled "Contacts Listing": a searchable
// PUBLIC DIRECTORY of Agents, Casting Professionals & Corporates, not a
// "send us a message" form to RafikiHub itself. The sidebar is a quick
// account-signup widget, not a repeat of the intro copy's enquiries email.
export default function ContactsPage({ navigate }: Props) {
  const { t } = useTheme()
  const [query, setQuery] = useState('')

  const inputStyle = { background: t.inputBg, border: `1px solid ${t.border}`, color: t.fg, fontFamily: 'var(--font-sans)' }
  const cardStyle = { background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }

  const filtered = contactDirectory.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))

  // Quick signup widget state
  const [signupSent, setSignupSent] = useState(false)
  const [signup, setSignup] = useState({ name: '', email: '', country: '', phone: '', gender: '' })

  const handleSignupSubmit = (e: FormEvent) => {
    e.preventDefault()
    const parts = signup.name.trim().split(/\s+/)
    const firstName = parts[0] ?? ''
    const lastName = parts.slice(1).join(' ')
    setSignupSent(true)
    navigate('register', { firstName, lastName, email: signup.email })
  }

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Rafiki Data Bank</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Contacts <em style={{ color: t.terra, fontStyle: 'italic' }}>Listing</em>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            Featuring listings for Agents, Corporates &amp; Casting Professionals, it's the go-to directory for anyone working or wanting to work in the African entertainment industry. Search by name or category below.
          </p>
          <p className="text-sm mt-4" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            Have a different question that isn't about a listing?{' '}
            <a href="mailto:info@rafikihub.com" className="font-semibold underline" style={{ color: t.terra }}>info@rafikihub.com</a>
          </p>
        </div>
      </section>

      <section className="py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 rounded-2xl p-8 md:p-10" style={cardStyle}>
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Search by Name</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={inputStyle}
                placeholder="Search the directory..."
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                    <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wide" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Name</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wide" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Category</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold uppercase tracking-wide" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                      <td className="py-3 px-2 font-semibold" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{c.name}</td>
                      <td className="py-3 px-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{c.category}</td>
                      <td className="py-3 px-2 text-right">
                        {/* No backend record exists behind these mock directory
                            entries, so OPEN routes to the generic profile view
                            rather than a specific listing. */}
                        <button
                          onClick={() => navigate('profile')}
                          className="px-4 py-1.5 rounded-md text-xs font-semibold"
                          style={{ background: t.g15, color: t.terra, fontFamily: 'var(--font-sans)' }}
                        >
                          OPEN
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>No listings match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl p-8" style={cardStyle}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Create New Account</h3>
            <p className="text-sm mb-6" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Not listed yet? Start your RafikiHub account here.</p>

            {signupSent ? (
              <p className="text-sm" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Taking you to the full sign-up form…</p>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Your Name</label>
                  <input required type="text" value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="Amara Diallo" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Your Email</label>
                  <input required type="email" value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Select Country</label>
                  <select required value={signup.country} onChange={(e) => setSignup({ ...signup, country: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle}>
                    <option value="" disabled>Select a country</option>
                    {fullCountryList.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Phone Number</label>
                  <input required type="tel" value={signup.phone} onChange={(e) => setSignup({ ...signup, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="+1 234 567 8901" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Gender</label>
                  <select required value={signup.gender} onChange={(e) => setSignup({ ...signup, gender: e.target.value })} className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle}>
                    <option value="" disabled>Select</option>
                    {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-[1.02]"
                  style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
                >
                  NEXT STEP →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
