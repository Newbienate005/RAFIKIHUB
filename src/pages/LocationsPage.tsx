import type { Page } from '../App'
import { useTheme } from '../theme'
import { locations } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

export default function LocationsPage({ navigate }: Props) {
  const { t } = useTheme()
  const total = locations.reduce((sum, l) => sum + l.memberCount, 0)

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>RafikiHub Locations</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Across the continent <em style={{ color: t.terra, fontStyle: 'italic' }}>and beyond</em>.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            {total.toLocaleString()}+ members across {locations.length} cities — and growing every month.
          </p>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((l) => (
            <div key={l.id} className="rounded-2xl overflow-hidden" style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }}>
              <div className="relative overflow-hidden" style={{ paddingBottom: '65%', background: t.muted }}>
                <img src={l.image} alt={l.city} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, #1A1816cc 100%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF' }}>{l.city}</h3>
                  <p className="text-sm" style={{ color: '#B9C2CE', fontFamily: 'var(--font-sans)' }}>{l.country}</p>
                </div>
              </div>
              <div className="p-5">
                <span className="text-sm font-medium" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
                  {l.memberCount.toLocaleString()} members
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.terra }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF', fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Don't see your city yet?
          </h2>
          <p className="text-base mb-8" style={{ color: '#FFFFFFcc', fontFamily: 'var(--font-sans)' }}>
            RafikiHub is fully remote-friendly — join from anywhere, no local chapter required.
          </p>
          <button
            onClick={() => navigate('join')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: '#FFFFFF', color: t.terra, fontFamily: 'var(--font-sans)' }}
          >
            Join the Hub
          </button>
        </div>
      </section>
    </div>
  )
}
