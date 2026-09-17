import { useState } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { blogPosts } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

export default function BlogListPage({ navigate }: Props) {
  const { t } = useTheme()
  const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))]
  const [active, setActive] = useState('All')

  const featured = blogPosts.find((p) => p.featured)
  const filtered = blogPosts.filter((p) => (active === 'All' || p.category === active) && p.id !== featured?.id)

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Our Blog</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            From the <em style={{ color: t.terra, fontStyle: 'italic' }}>community</em>.
          </h1>
        </div>
      </section>

      {featured && (
        <section className="py-20 px-6 md:px-16 lg:px-24">
          <button onClick={() => navigate('blog-article', featured)} className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center text-left group w-full">
            <div className="relative overflow-hidden rounded-2xl" style={{ paddingBottom: '65%', background: t.muted }}>
              <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Featured · {featured.category}</span>
              <h2 className="mt-3 mb-4 text-3xl md:text-4xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{featured.title}</h2>
              <p className="text-base leading-relaxed mb-5" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{featured.excerpt}</p>
              <span className="text-xs" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{featured.author} · {featured.date} · {featured.readTime} min read</span>
            </div>
          </button>
        </section>
      )}

      <section className="pb-24 px-6 md:px-16 lg:px-24">
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
          <div className="grid md:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <button key={p.id} onClick={() => navigate('blog-article', p)} className="text-left group flex flex-col">
                <div className="relative overflow-hidden rounded-xl mb-4" style={{ paddingBottom: '66%', background: t.muted }}>
                  <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                </div>
                <span className="text-xs uppercase tracking-wide mb-2" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>{p.category}</span>
                <h3 className="text-lg font-semibold mb-2 leading-snug" style={{ color: t.fg, fontFamily: 'var(--font-display)' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{p.excerpt}</p>
                <span className="text-xs mt-auto" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{p.author} · {p.readTime} min read</span>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-20 text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>No posts in this category yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
