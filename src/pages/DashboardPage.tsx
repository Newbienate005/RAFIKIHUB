import { useState, type FormEvent } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import { artists, plans, type DashboardRole } from '../data'
import { inputStyle, inputClass } from './dashboard/shared'
import PerformerDashboard from './dashboard/PerformerDashboard'
import CastingDashboard from './dashboard/CastingDashboard'
import CrewDashboard from './dashboard/CrewDashboard'
import PetDashboard from './dashboard/PetDashboard'
import RoomsDashboard from './dashboard/RoomsDashboard'

// DashboardRole now lives in data.ts (shared with RegisterPage's
// roleForMemberOption) — re-exported here so App.tsx's existing
// `import { type DashboardRole } from './pages/DashboardPage'` keeps working
// without every consumer needing to change its import path.
export type { DashboardRole }

interface Props {
  navigate: (page: Page, data?: unknown) => void
  role?: DashboardRole
  account?: { name: string; email: string }
}

const roleLabels: Record<DashboardRole, string> = {
  performer: 'Performer Dashboard',
  casting: 'Agent / Casting Dashboard',
  crew: 'Crew Dashboard',
  pet: 'Pet Dashboard',
  rooms: 'Rooms & Studio Dashboard',
}

export default function DashboardPage({ navigate, role = 'performer', account }: Props) {
  const { t } = useTheme()

  const demoUser = role === 'performer' ? artists[0] : artists.find((a) => a.category === 'Agent') ?? artists[3]
  const displayName = account?.name?.trim() || demoUser.name
  const firstName = displayName.split(' ')[0]

  // Billing badge in the top nav — derived from the account's implied plan.
  // There's no real subscription selection in this static frontend, so (as
  // with the rest of the dashboard) this defaults to the Professional plan,
  // matching the original wireframe's convention.
  const currentPlan = plans.find((p) => p.id === 'professional') ?? plans[0]
  const billingBadge = currentPlan.price > 0 ? 'Premium' : 'Free Version'

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwMessage, setPwMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault()
    if (!pw.current || !pw.next) {
      setPwMessage({ type: 'error', text: 'Please fill in your current and new password.' })
    } else if (pw.next !== pw.confirm) {
      setPwMessage({ type: 'error', text: 'New password and confirmation don’t match.' })
    } else {
      setPwMessage({ type: 'success', text: 'Password updated.' })
      setPw({ current: '', next: '', confirm: '' })
    }
  }

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-32 pb-10 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
                {roleLabels[role]}
              </span>
              <h1 className="mt-3 mb-2 font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: t.fg, fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
                Welcome back, {firstName}.
              </h1>
              <p className="text-sm max-w-2xl" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
                {account
                  ? 'Thanks for joining RafikiHub — here’s your new dashboard.'
                  : `This is a demo dashboard previewing ${demoUser.name}’s account.`}{' '}
                Sign-in isn&rsquo;t wired up in this wireframe, so changes you make here reset on reload.
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <span
                className="text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
                style={{ background: billingBadge === 'Premium' ? t.g15 : t.muted, color: billingBadge === 'Premium' ? t.terra : t.mutedFg, fontFamily: 'var(--font-sans)' }}
              >
                {billingBadge}
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowPasswordForm((v) => !v)}
                  className="text-xs font-semibold uppercase tracking-wide underline underline-offset-4"
                  style={{ color: t.fgDim, fontFamily: 'var(--font-sans)' }}
                >
                  Change Password
                </button>
                <button
                  onClick={() => navigate('home')}
                  className="text-xs font-semibold uppercase tracking-wide underline underline-offset-4"
                  style={{ color: '#D64545', fontFamily: 'var(--font-sans)' }}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="mt-8 rounded-2xl p-6 grid sm:grid-cols-3 gap-4 items-end" style={{ background: t.card, border: `1px solid ${t.border}` }}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Current Password</label>
                <input type="password" className={inputClass} style={inputStyle(t)} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>New Password</label>
                <input type="password" className={inputClass} style={inputStyle(t)} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Confirm New Password</label>
                <input type="password" className={inputClass} style={inputStyle(t)} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
              </div>
              <div className="sm:col-span-3 flex items-center gap-4">
                <button type="submit" className="px-6 py-3 rounded-md font-semibold text-sm" style={{ background: t.gold, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
                  Update Password
                </button>
                {pwMessage && (
                  <span className="text-sm font-medium" style={{ color: pwMessage.type === 'error' ? '#D64545' : t.terra, fontFamily: 'var(--font-sans)' }}>
                    {pwMessage.text}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {role === 'performer' && <PerformerDashboard t={t} navigate={navigate} account={account} />}
          {role === 'casting' && <CastingDashboard t={t} navigate={navigate} account={account} />}
          {role === 'crew' && <CrewDashboard t={t} navigate={navigate} account={account} />}
          {role === 'pet' && <PetDashboard t={t} navigate={navigate} account={account} />}
          {role === 'rooms' && <RoomsDashboard t={t} navigate={navigate} account={account} />}
        </div>
      </section>
    </div>
  )
}
