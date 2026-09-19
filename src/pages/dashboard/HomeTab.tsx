import { useState } from 'react'
import type { Page } from '../../App'
import type { Theme } from '../../theme'
import { dashboardHomeStats, type CvProfile } from '../../data'
import { cardStyle, SecondaryButton } from './shared'

interface Props {
  t: Theme
  navigate: (page: Page, data?: unknown) => void
  cv: CvProfile
}

// Performer dashboard HOME tab — dashboard/index.php performers-body.php.
// The 4 stat cards use the real, sitewide-hardcoded numbers from
// dashboardHomeStats verbatim (see data.ts comment) rather than anything
// derived from this demo account.
export default function HomeTab({ t, navigate, cv }: Props) {
  const [copied, setCopied] = useState(false)
  const [missingOpen, setMissingOpen] = useState(false)

  const profileUrl = `rafikihub.com/profile/${cv.profileLinkSlug}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${profileUrl}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can be unavailable (older browsers, insecure context) —
      // fail quietly rather than throwing, this is a cosmetic convenience only.
    }
  }

  const stats = [
    { label: 'Opportunities', value: dashboardHomeStats.opportunities },
    { label: 'Total Users', value: dashboardHomeStats.totalUsers },
    { label: 'Applications', value: dashboardHomeStats.applications },
    { label: 'Partners', value: dashboardHomeStats.partners },
  ]

  return (
    <div className="space-y-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-6" style={cardStyle(t)}>
            <div className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{s.value.toLocaleString()}</div>
            <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="rounded-xl p-6 space-y-3" style={cardStyle(t)}>
          <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Link URL</h4>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs truncate" style={{ background: t.inputBg, border: `1px solid ${t.border}`, color: t.fgDim, fontFamily: 'var(--font-sans)' }}>
            {profileUrl}
          </div>
          <div className="flex items-center gap-3">
            <SecondaryButton t={t} onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</SecondaryButton>
            <button onClick={() => navigate('profile')} className="text-xs font-semibold uppercase tracking-wide underline underline-offset-4" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
              View
            </button>
          </div>
        </div>

        <div className="rounded-xl p-6 space-y-3" style={cardStyle(t)}>
          <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Notifications</h4>
          <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}>
            0 New Notifications
          </span>
          <p className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>You&rsquo;re all caught up.</p>
        </div>

        <div className="rounded-xl p-6 space-y-3" style={cardStyle(t)}>
          <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Profile Complete</h4>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: t.muted }}>
            <div className="h-full rounded-full" style={{ width: `${cv.profileComplete}%`, background: t.terra }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{cv.profileComplete}%</span>
            {cv.missingFields.length > 0 && (
              <button onClick={() => setMissingOpen((v) => !v)} className="text-xs font-semibold underline underline-offset-4" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
                {missingOpen ? 'Hide' : 'What’s missing?'}
              </button>
            )}
          </div>
          {missingOpen && (
            <ul className="text-xs space-y-1 pt-1" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>
              {cv.missingFields.map((f) => (
                <li key={f}>&bull; {f}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
