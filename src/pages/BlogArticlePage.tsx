import type { Page } from '../App'
import { useTheme } from '../theme'
import { blogPosts, type BlogPost } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
  post: BlogPost
}

export default function BlogArticlePage({ navigate, post }: Props) {
  const { t } = useTheme()

  if (!post) {
    return (
      <div className="pt-40 pb-24 px-6 text-center" style={{ background: t.bg }}>
        <p style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Article not found.</p>
        <button onClick={() => navigate('blog')} className="mt-4 text-sm font-semibold" style={{ color: t.terra }}>← Back to blog</button>
      </div>
    )
  }

  const related = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)
  const paragraphs = [
    post.excerpt,
    'This story is one of hundreds shared across the RafikiHub community every year — proof that when opportunity is shared openly, talent finds its way. Members from Nairobi to Toronto continue to build on what came before them, one project at a time.',
    'If it resonates with you, RafikiHub has a place for your story too — whether that means joining a Knowledge Circle, applying for an Ubuntu Grant, or simply introducing yourself in the community forums.',
  ]

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-12 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('blog')} className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
            ← Back to Blog
          </button>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>{post.category}</span>
          <h1 className="mt-3 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 lg:px-24 mb-12">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl" style={{ paddingBottom: '52%', background: t.muted }}>
          <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      <section className="px-6 md:px-16 lg:px-24 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base leading-relaxed" style={{ color: t.fgDim, fontFamily: 'var(--font-sans)' }}>{para}</p>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-10" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>More in {post.category}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((p) => (
                <button key={p.id} onClick={() => navigate('blog-article', p)} className="text-left group flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-4" style={{ paddingBottom: '66%', background: t.muted }}>
                    <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug" style={{ color: t.fg, fontFamily: 'var(--font-display)' }}>{p.title}</h3>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
