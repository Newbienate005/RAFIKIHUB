import { useState } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { artists } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

export default function TalentManagementPage({ navigate }: Props) {
  const { t } = useTheme()
  const categories = ['All', ...Array.from(new Set(artists.map((a) => a.category)))]
  const [active, setActive] = useState('All')
  const filtered = artists.filter((a) => active === 'All' || a.category === active)

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Talents</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Meet our <em style={{ color: t.terra, fontStyle: 'italic' }}>rafikis</em>.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            Performers, agents, crew, and casting professionals — all represented, all discoverable.
          </p>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150"
                style={{
                  background: active === c ? t.terra : t.card,
                  color: active === c ? '#FFFFFF' : t.mutedFg,
                  border: `1px solid ${active === c ? t.terra : t.border}`,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((a) => (
              <button key={a.id} onClick={() => navigate('profile', a)} className="text-left group">
                <div className="relative overflow-hidden rounded-xl mb-4" style={{ paddingBottom: '100%', background: t.muted }}>
                  <img src={a.image} alt={a.name} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                </div>
                <h3 className="text-base font-semibold" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{a.name}</h3>
                <p className="text-sm" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>{a.category}</p>
                <p className="text-xs mt-1" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{a.location}</p>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-20 text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>No talent in this category yet.</p>
          )}
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Ready to be discovered?
          </h2>
          <button
            onClick={() => navigate('register')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
          >
            Create Your Profile
          </button>
        </div>
      </section>
    </div>
  )
}
