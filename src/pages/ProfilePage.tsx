import type { Page } from '../App'
import { useTheme } from '../theme'
import { artists, testimonials, type Artist } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
  artist?: Artist
}

export default function ProfilePage({ navigate, artist }: Props) {
  const { t } = useTheme()
  const a = artist ?? artists[0]
  const quote = testimonials.find((q) => q.name === a.name)
  const similar = artists.filter((x) => x.id !== a.id && x.category === a.category).slice(0, 3)

  return (
    <div style={{ background: t.bg }}>
      <section className="px-6 md:px-16 lg:px-24 pt-32 pb-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('talent')} className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
            ← Back to Talent
          </button>
        </div>
      </section>

      <section className="px-6 md:px-16 lg:px-24 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 items-start">
          <div className="relative overflow-hidden rounded-2xl" style={{ paddingBottom: '100%', background: t.muted }}>
            <img src={a.image} alt={a.name} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>{a.category}</span>
            <h1 className="mt-3 mb-2 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
              {a.name}
            </h1>
            <p className="text-sm mb-6" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{a.location} · {a.country}</p>
            <p className="text-base leading-relaxed mb-8" style={{ color: t.fgDim, fontFamily: 'var(--font-sans)' }}>{a.bio}</p>

            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Skills</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {a.skills.map((s) => (
                <span key={s} className="text-sm px-3 py-1.5 rounded-full" style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}>{s}</span>
              ))}
            </div>

            <button
              onClick={() => navigate('contacts')}
              className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
              style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
            >
              Get in Touch
            </button>
          </div>
        </div>

        {quote && (
          <div className="max-w-5xl mx-auto mt-16 pt-12 border-t" style={{ borderColor: t.border }}>
            <p className="text-xl leading-relaxed mb-4" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontStyle: 'italic' }}>
              "{quote.quote}"
            </p>
            <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>— {quote.name}, {quote.role}</p>
          </div>
        )}
      </section>

      {similar.length > 0 && (
        <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-10" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
              More {a.category}s
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {similar.map((s) => (
                <button key={s.id} onClick={() => navigate('profile', s)} className="text-left group">
                  <div className="relative overflow-hidden rounded-xl mb-4" style={{ paddingBottom: '100%', background: t.muted }}>
                    <img src={s.image} alt={s.name} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="text-base font-semibold" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{s.name}</h3>
                  <p className="text-sm" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>{s.location}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
