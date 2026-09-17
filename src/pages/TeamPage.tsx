import type { Page } from '../App'
import { useTheme } from '../theme'
import { team } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

export default function TeamPage({ navigate }: Props) {
  const { t } = useTheme()

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Our Team</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            The team behind <em style={{ color: t.terra, fontStyle: 'italic' }}>RafikiHub</em>.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            A small, distributed team spanning six countries — building a home for African creatives, one release at a time.
          </p>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {team.map((m) => (
            <div key={m.id} className="text-center">
              <div className="relative overflow-hidden rounded-2xl mb-5 mx-auto" style={{ paddingBottom: '100%', background: t.muted }}>
                <img src={m.photo} alt={m.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{m.name}</h3>
              <p className="text-sm mt-1" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>We're Hiring</span>
          <h2 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
            Want to help us build?
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
            We're always looking for people who understand African community first, and platforms second.
          </p>
          <button
            onClick={() => navigate('contacts')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
          >
            Get in touch
          </button>
        </div>
      </section>
    </div>
  )
}
