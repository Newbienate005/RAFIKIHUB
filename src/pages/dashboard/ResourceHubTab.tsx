import type { Page } from '../../App'
import type { Theme } from '../../theme'
import { performersCornerTable } from '../../data'
import { cardStyle, RowTable } from './shared'

interface Props {
  t: Theme
  navigate: (page: Page, data?: unknown) => void
}

export default function ResourceHubTab({ t, navigate }: Props) {
  return (
    <div className="space-y-10">
      <div className="grid sm:grid-cols-2 gap-5">
        <button onClick={() => navigate('blog')} className="text-left rounded-xl p-6 transition-transform duration-150 hover:scale-[1.02]" style={cardStyle(t)}>
          <h4 className="text-base font-semibold mb-1" style={{ fontFamily: 'var(--font-sans)', color: t.fg }}>Blog</h4>
          <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Industry news, tips and community stories.</p>
        </button>
        <button onClick={() => navigate('videos')} className="text-left rounded-xl p-6 transition-transform duration-150 hover:scale-[1.02]" style={cardStyle(t)}>
          <h4 className="text-base font-semibold mb-1" style={{ fontFamily: 'var(--font-sans)', color: t.fg }}>Video Library</h4>
          <p className="text-sm" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Masterclasses and training videos from working professionals.</p>
        </button>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Performers Corner</h3>
        <RowTable
          t={t}
          rows={performersCornerTable}
          columns={[
            { key: 'supplierName', label: 'Supplier Name' },
            { key: 'training', label: 'Training' },
            { key: 'type', label: 'Type' },
            { key: 'charges', label: 'Charges' },
          ]}
          renderActions={() => (
            <a href="mailto:info@rafikihub.com" className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
              Contact Us
            </a>
          )}
        />
      </div>
    </div>
  )
}
