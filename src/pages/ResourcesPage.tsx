import { useState, type FormEvent } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { artists, team, blogPosts } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

// Inspired by spotlight.com's "Resources" hub — a single page collecting the
// tools members reach for most: a contacts directory, career guides,
// casting insight, community events, and a stage-name checker.
const resourceCards = [
  {
    title: 'Rafiki Contacts',
    tag: 'Directory',
    body: 'The community\'s trusted directory — find agents, casting professionals, and vital services in one place.',
    cta: 'Browse Contacts',
    action: 'contacts' as const,
  },
  {
    title: 'Career & Industry Guides',
    tag: 'Guides',
    body: 'Essential reading on contracts, safeguarding, taxes, and building a sustainable creative career.',
    cta: 'Read the Guides',
    action: 'blog' as const,
  },
  {
    title: 'Casting Insights',
    tag: 'Video Library',
    body: 'Casting directors and professionals explain what actually gets a callback, in their own words.',
    cta: 'Watch Now',
    action: 'videos' as const,
  },
]

export default function ResourcesPage({ navigate }: Props) {
  const { t } = useTheme()
  const [nameInput, setNameInput] = useState('')
  const [result, setResult] = useState<'idle' | 'available' | 'taken'>('idle')

  const knowledgeCirclesPost = blogPosts.find((p) => p.id === 'knowledge-circles-launch')

  const takenNames = new Set(
    [...artists.map((a) => a.name), ...team.map((m) => m.name)].map((n) => n.trim().toLowerCase())
  )

  const checkName = (e: FormEvent) => {
    e.preventDefault()
    const normalized = nameInput.trim().toLowerCase()
    if (!normalized) return
    setResult(takenNames.has(normalized) ? 'taken' : 'available')
  }

  const inputStyle = { background: t.inputBg, border: `1px solid ${t.border}`, color: t.fg, fontFamily: 'var(--font-sans)' }

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-16 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Resources</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Tools built for <em style={{ color: t.terra, fontStyle: 'italic' }}>working creatives</em>.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            Everything a RafikiHub member reaches for — a trusted contacts directory, career guides, casting insight, and community events — in one place.
          </p>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {resourceCards.map((r) => (
            <button
              key={r.title}
              onClick={() => navigate(r.action)}
              className="text-left rounded-2xl p-8 flex flex-col justify-between transition-transform duration-150 hover:scale-[1.01]"
              style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)', minHeight: 200 }}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>{r.tag}</span>
                <h3 className="mt-2 text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{r.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{r.body}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold self-start" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
                {r.cta} →
              </span>
            </button>
          ))}

          {knowledgeCirclesPost && (
            <button
              onClick={() => navigate('blog-article', knowledgeCirclesPost)}
              className="text-left rounded-2xl p-8 flex flex-col justify-between transition-transform duration-150 hover:scale-[1.01]"
              style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)', minHeight: 200 }}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Community</span>
                <h3 className="mt-2 text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>Member Events & Knowledge Circles</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{knowledgeCirclesPost.excerpt}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold self-start" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
                Read the Story →
              </span>
            </button>
          )}

          {/* Stage Name Checker — interactive, inspired by Spotlight's Actor Name Checker */}
          <div className="text-left rounded-2xl p-8 md:col-span-2" style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }}>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Free Tool</span>
            <h3 className="mt-2 text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>Stage Name Checker</h3>
            <p className="text-sm leading-relaxed mb-6 max-w-xl" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
              Every performer profile on RafikiHub needs a unique name. Check yours before you register.
            </p>
            <form onSubmit={checkName} className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                value={nameInput}
                onChange={(e) => { setNameInput(e.target.value); setResult('idle') }}
                type="text"
                placeholder="e.g. Amara Diallo"
                className="flex-1 px-4 py-3 rounded-lg text-sm"
                style={inputStyle}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-md font-semibold text-sm whitespace-nowrap transition-transform duration-150 hover:scale-105"
                style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
              >
                Check Availability
              </button>
            </form>
            {result === 'available' && (
              <p className="mt-4 text-sm font-semibold" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
                ✓ "{nameInput.trim()}" is available.
              </p>
            )}
            {result === 'taken' && (
              <p className="mt-4 text-sm font-semibold" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                That name is already registered on RafikiHub — try adding a middle name or initial.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Ready to put these to work?
          </h2>
          <button
            onClick={() => navigate('join')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
          >
            Join RafikiHub
          </button>
        </div>
      </section>
    </div>
  )
}
