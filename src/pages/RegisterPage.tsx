import { useState, type FormEvent } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import {
  fullCountryList,
  genderOptions,
  guardianOptions,
  membershipCards,
  roleForMemberOption,
  wardrobeOptions,
} from '../data'

// This page now mirrors the real rafikihub.com two-step signup flow spread
// across register.php (the quick Step 1 "Create New Account" panel) and
// data/files/registerForm.php + data/files/signup.php (the full Step 2
// Personal Details / Account Details form). A few things are necessarily
// best-effort approximations since this is a static, no-backend frontend:
// the real Member Option / Member Category values are DB-driven (plans /
// plan_categories tables) — we use the same 8 real plan names and their
// real category lists from `membershipCards` — and the "Performer
// Specification" list shown for Young Performers has no static fallback in
// the real code at all, so it's a plausible placeholder here.

interface RegisterPrefill {
  firstName?: string
  lastName?: string
  email?: string
}

interface Props {
  navigate: (page: Page, data?: unknown) => void
  prefill?: RegisterPrefill
}

// DB-driven in the real site — no static fallback exists, so this is a
// best-effort placeholder list for the Young Performers "Performer
// Specification" field.
const performerSpecificationOptions = ['Acting', 'Singing', 'Dancing', 'Presenting']

// Options for which the real registerForm.php hides Gender/Date of Birth,
// since these member types represent organisations rather than individuals.
const organisationOptions = ['Casting Professionals', 'Rooms & Studio', 'Corporates']

interface CreditDraft {
  id: string
  title: string
  type: string
  date: string
  role: string
  company: string
  director: string
}

export default function RegisterPage({ navigate, prefill }: Props) {
  const { t } = useTheme()
  const [step, setStep] = useState<1 | 2>(1)

  // Carries a name/email typed into the homepage hero's quick-start panel
  // through to this fuller form, so a visitor never has to retype it.
  const [name, setName] = useState(`${prefill?.firstName ?? ''} ${prefill?.lastName ?? ''}`.trim())
  const [email, setEmail] = useState(prefill?.email ?? '')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')

  const [memberOption, setMemberOption] = useState(membershipCards[0].option)
  const selectedCard = membershipCards.find((c) => c.option === memberOption)
  const hasCategories = !!selectedCard?.categories
  const [memberCategory, setMemberCategory] = useState(selectedCard?.categories?.[0] ?? memberOption)

  const [wardrobeOption, setWardrobeOption] = useState(wardrobeOptions[0])
  const [performerSpecification, setPerformerSpecification] = useState(performerSpecificationOptions[0])
  const [guardianOption, setGuardianOption] = useState(guardianOptions[0])
  const [dob, setDob] = useState('')

  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [credits, setCredits] = useState<CreditDraft[]>([])
  const [creditDraft, setCreditDraft] = useState({ title: '', type: '', date: '', role: '', company: '', director: '' })
  const [creditsError, setCreditsError] = useState('')

  const isOrganisation = organisationOptions.includes(memberOption)
  const isYoungPerformer = memberCategory === 'Young Performer'
  const isWardrobe = memberCategory === 'Fashion Designer' || memberCategory === 'Fashion Stylist'
  const needsCredits = memberCategory === 'Actor' || memberCategory === 'Actress'

  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleMemberOptionChange = (option: string) => {
    setMemberOption(option)
    const card = membershipCards.find((c) => c.option === option)
    setMemberCategory(card?.categories?.[0] ?? option)
  }

  const addCredit = () => {
    if (!creditDraft.title.trim()) return
    setCredits([...credits, { id: `credit-${Date.now()}`, ...creditDraft }])
    setCreditDraft({ title: '', type: '', date: '', role: '', company: '', director: '' })
    setCreditsError('')
  }

  const removeCredit = (id: string) => {
    setCredits(credits.filter((c) => c.id !== id))
  }

  const handleFinalSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }
    if (password !== repeatPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    setPasswordError('')

    if (needsCredits && credits.length < 3) {
      setCreditsError('Actors and Actresses need at least 3 credits before creating an account.')
      return
    }
    setCreditsError('')

    navigate('dashboard', { role: roleForMemberOption(memberOption), account: { name, email } })
  }

  const inputStyle = { background: t.inputBg, border: `1px solid ${t.border}`, color: t.fg, fontFamily: 'var(--font-sans)' }
  const cardStyle = { background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }
  const labelClass = 'block text-xs font-semibold uppercase tracking-wide mb-2'
  const labelStyle = { color: t.mutedFg, fontFamily: 'var(--font-sans)' }

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-24 px-6 md:px-16 lg:px-24">
        <div className={step === 1 ? 'max-w-lg mx-auto' : 'max-w-2xl mx-auto'}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
              {step === 1 ? 'Sign Up' : 'Step 2 of 2'}
            </span>
            <h1 className="mt-4 mb-4 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              {step === 1 ? 'Create New Account' : 'Tell us more about you'}
            </h1>
            <p className="text-base" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
              {step === 1 ? 'Free to join. Takes about two minutes.' : 'Choose your membership option and finish setting up your profile.'}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="rounded-2xl p-8 md:p-10 space-y-5" style={cardStyle}>
              <div>
                <label className={labelClass} style={labelStyle}>Your Name</label>
                <input required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="Amara Diallo" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Your Email</label>
                <input required type="email" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Select Country</label>
                <select required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="" disabled>Choose a country</option>
                  {fullCountryList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Phone Number</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="+254 700 000000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Gender</label>
                <select required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="" disabled>Select gender</option>
                  {genderOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-[1.02]"
                style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
              >
                Next Step &rarr;
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="rounded-2xl p-8 md:p-10 space-y-8" style={cardStyle}>
              <fieldset className="space-y-5">
                <legend className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Personal Details</legend>
                <div>
                  <label className={labelClass} style={labelStyle}>Your Name</label>
                  <input required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Your Email</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Select Country</label>
                  <select required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="" disabled>Choose a country</option>
                    {fullCountryList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Contact Number</label>
                  <div className="flex gap-2">
                    <div className="w-14 px-3 py-3 rounded-lg text-sm text-center" style={{ ...inputStyle, opacity: 0.6 }}>+</div>
                    <input required type="tel" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                {!isOrganisation && (
                  <>
                    <div>
                      <label className={labelClass} style={labelStyle}>Select Gender</label>
                      <select required className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="" disabled>Select gender</option>
                        {genderOptions.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Date of Birth</label>
                      <input required type="date" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={dob} onChange={(e) => setDob(e.target.value)} />
                    </div>
                  </>
                )}
              </fieldset>

              <fieldset className="space-y-5">
                <legend className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Account Details</legend>

                <div>
                  <label className={labelClass} style={labelStyle}>Member Option</label>
                  <select className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={memberOption} onChange={(e) => handleMemberOptionChange(e.target.value)}>
                    {membershipCards.map((c) => (
                      <option key={c.option} value={c.option}>{c.option}</option>
                    ))}
                  </select>
                </div>

                {hasCategories && (
                  <div>
                    <label className={labelClass} style={labelStyle}>Member Category</label>
                    <select className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={memberCategory} onChange={(e) => setMemberCategory(e.target.value)}>
                      {selectedCard?.categories?.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* The real site's Wardrobe flow (Fashion Stylist / Fashion Designer) is
                    a separate sub-selector layered on top of a chosen category. Since our
                    Performers category list already lists "Fashion Designer" and "Fashion
                    Stylist" as selectable categories directly, a second, redundant
                    Wardrobe Option dropdown would just duplicate that choice — so it's
                    shown here as a lightweight confirmation field once one of those two
                    categories is picked, rather than a separate gating step. */}
                {isWardrobe && (
                  <div>
                    <label className={labelClass} style={labelStyle}>Wardrobe Option</label>
                    <select className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={wardrobeOption} onChange={(e) => setWardrobeOption(e.target.value)}>
                      {wardrobeOptions.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                )}

                {isYoungPerformer && (
                  <>
                    <div>
                      <label className={labelClass} style={labelStyle}>Performer Specification</label>
                      <select className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={performerSpecification} onChange={(e) => setPerformerSpecification(e.target.value)}>
                        {performerSpecificationOptions.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Parent/Guardian Option</label>
                      <select className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={guardianOption} onChange={(e) => setGuardianOption(e.target.value)}>
                        {guardianOptions.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass} style={labelStyle}>Enter Password</label>
                    <input required type="password" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Repeat Password</label>
                    <input required type="password" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="••••••••" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                  </div>
                </div>
                {passwordError && (
                  <p className="text-sm" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>{passwordError}</p>
                )}

                {needsCredits && (
                  <div className="rounded-xl p-5" style={{ background: t.bg2, border: `1px solid ${t.border}` }}>
                    <label className={labelClass} style={labelStyle}>My Credits (minimum 3 required)</label>
                    <p className="text-xs mb-4" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>
                      Add at least 3 acting credits — RafikiHub requires this for Actor and Actress accounts.
                    </p>

                    {credits.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {credits.map((c) => (
                          <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm" style={{ background: t.card, border: `1px solid ${t.border}`, color: t.fgDim, fontFamily: 'var(--font-sans)' }}>
                            <span className="truncate">{c.title || 'Untitled'} — {c.role || 'Role'} ({c.company || 'Company'})</span>
                            <button type="button" onClick={() => removeCredit(c.id)} className="text-xs font-semibold shrink-0" style={{ color: t.terra }}>Remove</button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <input className="px-3 py-2 rounded-lg text-sm" style={inputStyle} placeholder="Title" value={creditDraft.title} onChange={(e) => setCreditDraft({ ...creditDraft, title: e.target.value })} />
                      <input className="px-3 py-2 rounded-lg text-sm" style={inputStyle} placeholder="Type (e.g. Film, TV)" value={creditDraft.type} onChange={(e) => setCreditDraft({ ...creditDraft, type: e.target.value })} />
                      <input className="px-3 py-2 rounded-lg text-sm" style={inputStyle} placeholder="Date" value={creditDraft.date} onChange={(e) => setCreditDraft({ ...creditDraft, date: e.target.value })} />
                      <input className="px-3 py-2 rounded-lg text-sm" style={inputStyle} placeholder="Role" value={creditDraft.role} onChange={(e) => setCreditDraft({ ...creditDraft, role: e.target.value })} />
                      <input className="px-3 py-2 rounded-lg text-sm" style={inputStyle} placeholder="Company" value={creditDraft.company} onChange={(e) => setCreditDraft({ ...creditDraft, company: e.target.value })} />
                      <input className="px-3 py-2 rounded-lg text-sm" style={inputStyle} placeholder="Director" value={creditDraft.director} onChange={(e) => setCreditDraft({ ...creditDraft, director: e.target.value })} />
                    </div>
                    <button
                      type="button"
                      onClick={addCredit}
                      className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wide"
                      style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}
                    >
                      + Add Credit
                    </button>
                    {creditsError && (
                      <p className="text-sm mt-3" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>{creditsError}</p>
                    )}
                  </div>
                )}

                <p className="text-xs" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>
                  By creating an account you agree to our{' '}
                  <button type="button" onClick={() => navigate('terms')} className="underline" style={{ color: t.mutedFg }}>Terms &amp; Conditions</button>
                  {' '}and{' '}
                  <button type="button" onClick={() => navigate('privacy')} className="underline" style={{ color: t.mutedFg }}>Privacy Policy</button>.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-md font-semibold text-sm"
                    style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.mutedFg, fontFamily: 'var(--font-sans)' }}
                  >
                    &larr; Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-[1.02]"
                    style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
                  >
                    Create Account
                  </button>
                </div>
              </fieldset>
            </form>
          )}

          <p className="text-center mt-8 text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            Not sure which option is right for you?{' '}
            <button onClick={() => navigate('join')} className="font-semibold underline" style={{ color: t.terra }}>View membership options</button>
          </p>
        </div>
      </section>
    </div>
  )
}
