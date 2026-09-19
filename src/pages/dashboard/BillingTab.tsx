import type { Page } from '../../App'
import type { Theme } from '../../theme'
import type { Plan, BillingRecord } from '../../data'
import { cardStyle } from './shared'

interface Props {
  t: Theme
  navigate: (page: Page, data?: unknown) => void
  currentPlan: Plan
  billingHistory: BillingRecord[]
}

export default function BillingTab({ t, navigate, currentPlan, billingHistory }: Props) {
  return (
    <div className="space-y-10">
      <div className="rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: t.gold }}>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#FFFFFFcc', fontFamily: 'var(--font-sans)' }}>Current Plan</span>
          <h3 className="mt-2 text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF' }}>{currentPlan.name} &mdash; ${currentPlan.price}/{currentPlan.period}</h3>
        </div>
        <button
          onClick={() => navigate('options')}
          className="px-6 py-3 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-105 flex-shrink-0"
          style={{ background: '#FFFFFF', color: t.gold, fontFamily: 'var(--font-sans)' }}
        >
          Manage Plan
        </button>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Billing History</h3>
        <div className="rounded-xl overflow-hidden" style={cardStyle(t)}>
          {billingHistory.map((b, i) => (
            <div key={b.id} className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${t.border}` }}>
              <div>
                <div className="text-sm font-medium" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{b.description}</div>
                <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{b.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>${b.amount.toFixed(2)}</span>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: b.status === 'Paid' ? t.terra : '#D64545' }}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
