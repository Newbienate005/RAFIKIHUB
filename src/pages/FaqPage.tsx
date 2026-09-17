import { useState } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { faqs } from '../data'

interface Props {
  navigate: (page: Page, data?: unknown) => void
}

export default function FaqPage({ navigate }: Props) {
  const { t } = useTheme()
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)
  const categories = Array.from(new Set(faqs.map((f) => f.category)))

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Help &amp; FAQs</span>
          <h1 className="mt-4 mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}>
            Frequently asked <em style={{ color: t.terra, fontStyle: 'italic' }}>questions</em>.
          </h1>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          {categories.map((cat) => (
            <div key={cat} className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>{cat}</h2>
              <div className="space-y-3">
                {faqs.filter((f) => f.category === cat).map((f) => {
                  const open = openId === f.id
                  return (
                    <div key={f.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.border}`, background: t.card }}>
                      <button
                        onClick={() => setOpenId(open ? null : f.id)}
                        className="w-full flex items-center justify-between text-left px-6 py-5"
                      >
                        <span className="font-semibold text-sm md:text-base pr-4" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{f.question}</span>
                        <span
                          className="flex-shrink-0 text-xl transition-transform duration-200"
                          style={{ color: t.terra, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
                        >
                          +
                        </span>
                      </button>
                      {open && (
                        <div className="px-6 pb-5">
                          <p className="text-sm leading-relaxed" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{f.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: t.bg2 }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
            Still have a question?
          </h2>
          <button
            onClick={() => navigate('contacts')}
            className="px-8 py-4 rounded-md font-semibold text-base transition-transform duration-150 hover:scale-105"
            style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  )
}
