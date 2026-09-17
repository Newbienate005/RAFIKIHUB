import { useState } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { videos } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

export default function VideosPage({ navigate }: Props) {
  const { t } = useTheme()
  const categories = ['All', ...Array.from(new Set(videos.map((v) => v.category)))]
  const [active, setActive] = useState('All')
  const filtered = videos.filter((v) => active === 'All' || v.category === active)

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Video Library</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Learn from <em style={{ color: t.terra, fontStyle: 'italic' }}>working artists</em>.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            Free workshops and masterclasses taught by RafikiHub's own community of performers and crew.
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((v) => (
              <div key={v.id} className="rounded-xl overflow-hidden group cursor-default" style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }}>
                <div className="relative overflow-hidden" style={{ paddingBottom: '58%', background: t.muted }}>
                  <img src={v.thumbnail} alt={v.title} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#1A181633' }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#FFFFFFdd' }}>
                      <span style={{ color: t.terra, fontSize: 20, marginLeft: 3 }}>▶</span>
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-medium" style={{ background: '#1A1816cc', color: '#FFFFFF' }}>
                    {v.duration}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-xs uppercase tracking-wide" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>{v.category}</span>
                  <h3 className="text-base font-semibold mt-2 mb-1 leading-snug" style={{ color: t.fg, fontFamily: 'var(--font-display)' }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>with {v.instructor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Want to teach a workshop?
          </h2>
          <button
            onClick={() => navigate('contacts')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
          >
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  )
}
