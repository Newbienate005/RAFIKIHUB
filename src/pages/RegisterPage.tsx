import { useState, type FormEvent } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'

interface RegisterPrefill {
  firstName?: string
  lastName?: string
  email?: string
}

interface Props {
  navigate: (page: Page, data?: unknown) => void
  prefill?: RegisterPrefill
}

export default function RegisterPage({ navigate, prefill }: Props) {
  const { t } = useTheme()
  const [category, setCategory] = useState<'Performer' | 'Agent' | 'Crew' | 'Casting Professional'>('Performer')
  // Carries a name/email typed into the homepage hero's quick-start panel
  // through to this fuller form, so a visitor never has to retype it.
  const [form, setForm] = useState({
    firstName: prefill?.firstName ?? '',
    lastName: prefill?.lastName ?? '',
    email: prefill?.email ?? '',
  })

  // Performers land on the Performer dashboard; Agents, Crew, and Casting
  // Professionals all manage talent/listings/castings on behalf of others,
  // so they land on the Talent Manager dashboard instead.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const role = category === 'Performer' ? 'performer' : 'manager'
    const name = `${form.firstName} ${form.lastName}`.trim()
    navigate('dashboard', { role, account: { name, email: form.email } })
  }

  const inputStyle = { background: t.inputBg, border: `1px solid ${t.border}`, color: t.fg, fontFamily: 'var(--font-sans)' }

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Sign Up</span>
            <h1 className="mt-4 mb-4 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Create your account
            </h1>
            <p className="text-base" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
              Free to join. Takes about two minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl p-8 md:p-10 space-y-5" style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }}>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>First Name</label>
                <input required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="Amara" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Last Name</label>
                <input required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="Diallo" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Email</label>
              <input required type="email" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Password</label>
              <input required type="password" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>I am a...</label>
              <p className="text-xs mb-3" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>
                {category === 'Performer' ? 'Takes you to the Performer Dashboard.' : 'Takes you to the Talent Manager Dashboard.'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(['Performer', 'Agent', 'Crew', 'Casting Professional'] as const).map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCategory(c)}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors duration-150"
                    style={{
                      background: category === c ? t.g10 : 'transparent',
                      border: `1px solid ${category === c ? t.terra : t.border}`,
                      color: category === c ? t.terra : t.fgDim,
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-[1.02]"
              style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
            >
              Create Account
            </button>
            <p className="text-center text-xs" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>
              By joining you agree to our{' '}
              <button type="button" onClick={() => navigate('terms')} className="underline" style={{ color: t.mutedFg }}>Terms</button>
              {' '}and{' '}
              <button type="button" onClick={() => navigate('privacy')} className="underline" style={{ color: t.mutedFg }}>Privacy Policy</button>.
            </p>
          </form>

          <p className="text-center mt-8 text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            Looking for a paid plan instead?{' '}
            <button onClick={() => navigate('options')} className="font-semibold underline" style={{ color: t.terra }}>View membership options</button>
          </p>
        </div>
      </section>
    </div>
  )
}
