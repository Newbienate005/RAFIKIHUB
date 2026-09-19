import { useState, type FormEvent } from 'react'
import type { Page } from '../../App'
import type { Theme } from '../../theme'
import {
  artists, plans, billingHistory, talentRoster as initialRoster, castingCalls as initialCalls,
  type CastingCall, type Artist,
} from '../../data'
import { cardStyle, inputStyle, inputClass, PrimaryButton, SectionCard, Field } from './shared'
import AccountTab, { type AccountDetails } from './AccountTab'
import BillingTab from './BillingTab'

interface Props {
  t: Theme
  navigate: (page: Page, data?: unknown) => void
  account?: { name: string; email: string }
}

type Tab = 'overview' | 'account' | 'roster' | 'calls' | 'billing'

// Agents / Casting Professionals / Corporates — agents-and-casting-body.php.
// This keeps close to the original "manager" dashboard's roster/casting-call
// workflows (already a reasonably close match to the real thing) with tab
// labels aligned to the rest of the rebuilt nav.
export default function CastingDashboard({ t, navigate, account }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const demoUser: Artist = artists.find((a) => a.category === 'Agent') ?? artists[3]
  const displayName = account?.name?.trim() || demoUser.name

  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    name: displayName,
    email: account?.email?.trim() || `${demoUser.name.toLowerCase().replace(/\s+/g, '.')}@rafikihub.com`,
    phone: '+254 700 000 000',
    website: '',
    country: demoUser.country,
  })

  const [roster, setRoster] = useState<Artist[]>(initialRoster)
  const removeFromRoster = (id: string) => setRoster((prev) => prev.filter((a) => a.id !== id))

  const [calls, setCalls] = useState<CastingCall[]>(initialCalls)
  const [newCall, setNewCall] = useState({ title: '', category: 'Performer' })

  const toggleCallStatus = (id: string) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Open' ? 'Closed' : 'Open' } : c)))
  }
  const handlePostCall = (e: FormEvent) => {
    e.preventDefault()
    if (!newCall.title) return
    setCalls((prev) => [
      { id: `cc-${Date.now()}`, title: newCall.title, category: newCall.category, applicants: 0, status: 'Open', postedDate: 'Just now' },
      ...prev,
    ])
    setNewCall({ title: '', category: 'Performer' })
  }

  const currentPlan = plans.find((p) => p.id === 'agency') ?? plans[0]

  const stats = [
    { label: 'Talent on Roster', value: roster.length },
    { label: 'Open Casting Calls', value: calls.filter((c) => c.status === 'Open').length },
    { label: 'Total Applicants', value: calls.reduce((sum, c) => sum + c.applicants, 0) },
    { label: 'Current Plan', value: currentPlan.name },
  ]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'account', label: 'My Profile & Account' },
    { id: 'roster', label: 'My Talent Roster' },
    { id: 'calls', label: 'Casting Calls' },
    { id: 'billing', label: 'Billing' },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors duration-150"
            style={{ background: tab === tb.id ? t.terra : 'transparent', color: tab === tb.id ? '#FFFFFF' : t.fgDim, border: `1px solid ${tab === tb.id ? t.terra : t.border}`, fontFamily: 'var(--font-sans)' }}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl p-6" style={cardStyle(t)}>
                <div className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{s.value}</div>
                <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Recent Activity</h3>
          <div className="rounded-xl overflow-hidden" style={cardStyle(t)}>
            {calls.slice(0, 2).map((c, i) => (
              <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${t.border}` }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{c.title}</div>
                  <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{c.applicants} applicant{c.applicants === 1 ? '' : 's'} &middot; {c.postedDate}</div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.status === 'Open' ? t.terra : t.subtle }}>{c.status}</span>
              </div>
            ))}
            {roster.slice(0, 3).map((a, i) => (
              <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderTop: (i === 0 && calls.length === 0) ? 'none' : `1px solid ${t.border}` }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{a.name}</div>
                  <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>On your roster &middot; {a.category}</div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.mutedFg }}>Represented</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'account' && <AccountTab t={t} account={accountDetails} setAccount={setAccountDetails} />}

      {tab === 'roster' && (
        <div>
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>My Talent Roster</h3>
            <button onClick={() => navigate('talent')} className="text-xs font-semibold underline underline-offset-4" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
              Discover more talent &rarr;
            </button>
          </div>

          {roster.length === 0 && (
            <p className="text-sm py-10 text-center" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>You don&rsquo;t represent any talent yet.</p>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            {roster.map((a) => (
              <div key={a.id} className="rounded-xl overflow-hidden flex" style={cardStyle(t)}>
                <div className="relative w-28 flex-shrink-0 overflow-hidden" style={{ background: t.muted }}>
                  <img src={a.image} alt={a.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-sans)', color: t.fg }}>{a.name}</h4>
                    <p className="text-xs mb-1" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>{a.category}</p>
                    <p className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{a.location}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => navigate('profile', a)} className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.fgDim }}>View</button>
                    <button onClick={() => removeFromRoster(a.id)} className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#D64545' }}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'calls' && (
        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Casting Calls</h3>
            <div className="rounded-xl overflow-hidden" style={cardStyle(t)}>
              {calls.length === 0 && (
                <p className="text-sm py-10 text-center" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>You haven&rsquo;t posted any casting calls yet.</p>
              )}
              {calls.map((c, i) => (
                <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap" style={{ borderTop: i === 0 ? 'none' : `1px solid ${t.border}` }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{c.title}</div>
                    <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{c.category} &middot; {c.applicants} applicant{c.applicants === 1 ? '' : 's'} &middot; {c.postedDate}</div>
                  </div>
                  <button
                    onClick={() => toggleCallStatus(c.id)}
                    className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors duration-150"
                    style={{ background: c.status === 'Open' ? 'transparent' : t.terra, color: c.status === 'Open' ? t.fgDim : '#FFFFFF', border: `1px solid ${c.status === 'Open' ? t.border : t.terra}`, fontFamily: 'var(--font-sans)' }}
                  >
                    {c.status === 'Open' ? 'Close Call' : 'Reopen Call'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handlePostCall}>
            <SectionCard t={t} title="Post a New Casting Call">
              <div className="grid md:grid-cols-2 gap-5">
                <Field t={t} label="Role / Title">
                  <input className={inputClass} style={inputStyle(t)} placeholder="e.g. Supporting Actor — Feature Film" value={newCall.title} onChange={(e) => setNewCall({ ...newCall, title: e.target.value })} />
                </Field>
                <Field t={t} label="Looking For">
                  <select className={inputClass} style={inputStyle(t)} value={newCall.category} onChange={(e) => setNewCall({ ...newCall, category: e.target.value })}>
                    {['Performer', 'Crew', 'Young Performer'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
              <PrimaryButton t={t} type="submit">Post Casting Call</PrimaryButton>
            </SectionCard>
          </form>
        </div>
      )}

      {tab === 'billing' && <BillingTab t={t} navigate={navigate} currentPlan={currentPlan} billingHistory={billingHistory} />}
    </div>
  )
}
