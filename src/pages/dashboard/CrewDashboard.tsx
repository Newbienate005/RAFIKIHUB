import { useState } from 'react'
import type { Page } from '../../App'
import type { Theme } from '../../theme'
import { artists, plans, billingHistory, demoCvProfile, type Artist, type CvProfile } from '../../data'
import { cardStyle, SectionCard, inputStyle, inputClass, PillTabs } from './shared'
import AccountTab, { type AccountDetails } from './AccountTab'
import BillingTab from './BillingTab'
import EditCvSkillsLinks from './EditCvSkillsLinks'
import EditCvCredits from './EditCvCredits'

interface Props {
  t: Theme
  navigate: (page: Page, data?: unknown) => void
  account?: { name: string; email: string }
}

type Tab = 'overview' | 'account' | 'portfolio' | 'billing'
type PortfolioPill = 'about' | 'skills' | 'credits'

// Crew — production.php on the real site is thinner than the performer
// dashboard, so this is a reasonably simplified variant: Overview / Profile
// & Account / Portfolio (About Me + a trimmed CV reusing the same Skills &
// Links and Credits components as the performer's Edit CV) / Billing.
export default function CrewDashboard({ t, navigate, account }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [portfolioPill, setPortfolioPill] = useState<PortfolioPill>('about')

  const demoUser: Artist = artists.find((a) => a.category === 'Crew') ?? artists[1]
  const displayName = account?.name?.trim() || demoUser.name

  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    name: displayName,
    email: account?.email?.trim() || `${demoUser.name.toLowerCase().replace(/\s+/g, '.')}@rafikihub.com`,
    phone: '+254 700 000 000',
    website: '',
    country: demoUser.country,
  })

  const [cv, setCv] = useState<CvProfile>(() => ({ ...demoCvProfile, name: displayName, credits: [] }))

  const currentPlan = plans[0]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'account', label: 'My Profile & Account' },
    { id: 'portfolio', label: 'Portfolio' },
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
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-xl p-6" style={cardStyle(t)}>
            <div className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{cv.skills.length}</div>
            <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Skills Listed</div>
          </div>
          <div className="rounded-xl p-6" style={cardStyle(t)}>
            <div className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{currentPlan.name}</div>
            <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Current Plan</div>
          </div>
          <button onClick={() => navigate('profile')} className="text-left rounded-xl p-6 sm:col-span-2 transition-transform duration-150 hover:scale-[1.01]" style={cardStyle(t)}>
            <h4 className="text-sm font-semibold mb-1" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>View My Public Profile &rarr;</h4>
            <p className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>See your portfolio the way productions see it.</p>
          </button>
        </div>
      )}

      {tab === 'account' && <AccountTab t={t} account={accountDetails} setAccount={setAccountDetails} />}

      {tab === 'portfolio' && (
        <div>
          <PillTabs
            t={t}
            active={portfolioPill}
            onChange={setPortfolioPill}
            tabs={[{ id: 'about', label: 'About & Training' }, { id: 'skills', label: 'Skills & Links' }, { id: 'credits', label: 'Credits' }]}
          />
          {portfolioPill === 'about' && (
            <SectionCard t={t} title="About Me">
              <textarea rows={6} className={inputClass} style={inputStyle(t)} value={cv.aboutMe} onChange={(e) => setCv({ ...cv, aboutMe: e.target.value })} />
            </SectionCard>
          )}
          {portfolioPill === 'skills' && <EditCvSkillsLinks t={t} cv={cv} setCv={setCv} />}
          {portfolioPill === 'credits' && <EditCvCredits t={t} cv={cv} setCv={setCv} />}
        </div>
      )}

      {tab === 'billing' && <BillingTab t={t} navigate={navigate} currentPlan={currentPlan} billingHistory={billingHistory} />}
    </div>
  )
}
