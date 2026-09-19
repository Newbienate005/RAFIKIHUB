import { useState, type FormEvent } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { artists, demoCvProfile, type Artist } from '../data'
import { cardStyle, inputStyle, inputClass, PrimaryButton } from './dashboard/shared'
import { computeAge, SkillsTable, CreditsTable, TrainingTable } from './dashboard/cvDisplay'

interface Props {
  navigate: (page: Page, data?: unknown) => void
  artist?: Artist
}

type ProfileTab = 'profile' | 'skills' | 'credits' | 'media'

// This mirrors the real rafikihub.com profile.php: a photo/contact sidebar
// plus a tabbed PROFILE / SKILLS / CREDITS / MEDIA & FILES main area, driven
// by the full CV shape (dateOfBirth, appearance, voice attributes, skills,
// credits, etc) rather than the old flat Artist bio.
//
// Simplification: `Artist` (passed in from talent listings) doesn't carry
// any of those CV fields — there's no backend mapping a specific artist to
// a full CV record yet — so the header/photo card uses the passed Artist's
// name/image/category/location, while every detailed CV-shaped field below
// is sourced from `demoCvProfile` regardless of which artist was clicked.
export default function ProfilePage({ navigate, artist }: Props) {
  const { t } = useTheme()
  const a = artist ?? artists[0]
  const cv = demoCvProfile

  const [tab, setTab] = useState<ProfileTab>('profile')
  const [emailOpen, setEmailOpen] = useState(false)
  const [emailForm, setEmailForm] = useState({ name: '', email: '', message: '' })
  const [emailSent, setEmailSent] = useState(false)

  const age = computeAge(cv.dateOfBirth)

  const handleSendEmail = (e: FormEvent) => {
    e.preventDefault()
    setEmailSent(true)
    setEmailForm({ name: '', email: '', message: '' })
  }

  const whatsappHref = cv.phone ? `https://wa.me/${cv.phone.replace(/[^\d]/g, '')}` : ''

  const socialLinks = [
    { label: 'IG', href: cv.instagramUrl ? `https://${cv.instagramUrl.replace(/^https?:\/\//, '')}` : '' },
    { label: 'X', href: cv.twitterUrl ? `https://${cv.twitterUrl.replace(/^https?:\/\//, '')}` : '' },
    { label: 'FB', href: cv.facebookUrl ? `https://${cv.facebookUrl.replace(/^https?:\/\//, '')}` : '' },
    { label: 'WA', href: whatsappHref },
  ].filter((s) => s.href)

  const galleryPhotos = [a.image, `https://picsum.photos/seed/${a.id}-1/500/500`, `https://picsum.photos/seed/${a.id}-2/500/500`, `https://picsum.photos/seed/${a.id}-3/500/500`]

  const profileFacts: [string, string][] = [
    ['Date of Birth', cv.dateOfBirth ? `${cv.dateOfBirth}${age !== null ? ` (age ${age})` : ''}` : '—'],
    ['Playing Age', `${cv.playingAgeFrom || '—'} – ${cv.playingAgeTo || '—'}`],
    ['Country', cv.country || '—'],
    ['Height', `${cv.heightFeet || '—'} ${cv.heightInches || ''}`.trim()],
    ['Cities', cv.cities.join(', ') || '—'],
    ['Nationalities', cv.nationalities.join(', ') || '—'],
    ['Appearance', cv.appearance || '—'],
    ['Eye Color', cv.eyeColor || '—'],
    ['Hair Color', cv.hairColor || '—'],
    ['Hair Length', cv.hairLength || '—'],
    ['Facial Hair', cv.facialHair || '—'],
    ['Voice Quality', cv.voiceQuality || '—'],
    ['Voice Character', cv.voiceCharacter || '—'],
    ['Low Voice', cv.lowVoice || '—'],
    ['Medium Voice', cv.mediumVoice || '—'],
    ['High Voice', cv.highVoice || '—'],
  ]

  const measurementFacts: [string, string][] = [
    ['Bust/Chest', cv.bustChest], ['Waist', cv.waist], ['Hips', cv.hips], ['Inside Leg', cv.insideLeg],
    ['Inside Arm', cv.insideArm], ['Collar', cv.collar], ['Hat', cv.hat], ['Weight (Kg)', cv.weightKg],
    ['Shoe Size', cv.shoeSize], ['Dress Size', cv.dressSize],
  ]

  return (
    <div style={{ background: t.bg }}>
      <section className="px-6 md:px-16 lg:px-24 pt-32 pb-4">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate('talent')} className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
            ← Back to Talent
          </button>
        </div>
      </section>

      <section className="px-6 md:px-16 lg:px-24 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 items-start">
          {/* Left column: photo + contact details */}
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden" style={cardStyle(t)}>
              <div className="relative overflow-hidden" style={{ paddingBottom: '100%', background: t.muted }}>
                <img src={a.image} alt={a.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h1 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{a.name}</h1>
                <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full" style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}>{a.category}</span>
              </div>
            </div>

            <div className="rounded-2xl p-6 space-y-4" style={cardStyle(t)}>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Contact Details</h3>
              <div className="space-y-3 text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle }}>Country</div>
                  <div style={{ color: t.fg }}>{cv.country || a.country}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle }}>Website</div>
                  <div style={{ color: cv.website ? t.terra : t.mutedFg }}>{cv.website || 'No Website'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle }}>Phone</div>
                  <div style={{ color: t.fg }}>{cv.phone || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle }}>Physical Address</div>
                  <div style={{ color: t.fg }}>{cv.physicalAddress || '—'}</div>
                </div>
              </div>

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: t.border }}>
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold"
                      style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              )}

              <button
                onClick={() => setEmailOpen((v) => !v)}
                className="w-full px-6 py-3.5 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-105"
                style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
              >
                Email {a.name.split(' ')[0]} &rarr;
              </button>

              {emailOpen && (
                <form onSubmit={handleSendEmail} className="pt-2 space-y-3 border-t" style={{ borderColor: t.border }}>
                  {emailSent ? (
                    <p className="text-sm font-medium py-2" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Message sent!</p>
                  ) : (
                    <>
                      <input required placeholder="Your Name" className={inputClass} style={inputStyle(t)} value={emailForm.name} onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })} />
                      <input required type="email" placeholder="Your Email" className={inputClass} style={inputStyle(t)} value={emailForm.email} onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })} />
                      <textarea required rows={3} placeholder="Email Message" className={inputClass} style={inputStyle(t)} value={emailForm.message} onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })} />
                      <PrimaryButton t={t} type="submit" className="w-full">Send</PrimaryButton>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-4 gap-3">
              {galleryPhotos.map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded-xl" style={{ paddingBottom: '100%', background: t.muted }}>
                  <img src={src} alt={`${a.name} ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 border-b" style={{ borderColor: t.border }}>
              {([
                ['profile', 'Profile'], ['skills', 'Skills'], ['credits', 'Credits'], ['media', 'Media & Files'],
              ] as [ProfileTab, string][]).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide -mb-px"
                  style={{ color: tab === id ? t.terra : t.mutedFg, borderBottom: tab === id ? `2px solid ${t.terra}` : '2px solid transparent', fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === 'profile' && (
              <div className="space-y-8">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {profileFacts.map(([label, value]) => (
                    <div key={label}>
                      <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{label}</div>
                      <div className="text-sm" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {cv.showFurtherMeasurements && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Further Measurements</h3>
                    <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-5">
                      {measurementFacts.map(([label, value]) => (
                        <div key={label}>
                          <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{label}</div>
                          <div className="text-sm" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{value || '—'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Distinguishing Traits</h3>
                  {cv.distinguishingTraits.length === 0 ? (
                    <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>None listed.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cv.distinguishingTraits.map((tr, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 rounded-full" style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}>{tr.trait} &middot; {tr.location}</span>
                      ))}
                    </div>
                  )}
                  {cv.hasTwin && <p className="text-xs mt-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Has an identical twin.</p>}
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Training</h3>
                  <TrainingTable t={t} training={cv.training} />
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>About Me</h3>
                  <p className="text-base leading-relaxed" style={{ color: t.fgDim, fontFamily: 'var(--font-sans)' }}>{cv.aboutMe || a.bio}</p>
                </div>
              </div>
            )}

            {tab === 'skills' && <SkillsTable t={t} skills={cv.skills} />}

            {tab === 'credits' && <CreditsTable t={t} credits={cv.credits} />}

            {tab === 'media' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Photos</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {galleryPhotos.map((src, i) => (
                      <div key={i} className="relative overflow-hidden rounded-lg" style={{ paddingBottom: '100%', background: t.muted }}>
                        <img src={src} alt={`Gallery ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Video Showreel</h3>
                  <div className="rounded-xl flex items-center justify-center text-sm py-16" style={{ ...cardStyle(t), color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>No showreel uploaded yet.</div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Voiceover Reel</h3>
                  <div className="rounded-xl flex items-center justify-center text-sm py-10" style={{ ...cardStyle(t), color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>No voiceover reel uploaded yet.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
