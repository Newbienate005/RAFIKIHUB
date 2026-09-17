import { useState, type FormEvent } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import {
  artists,
  plans,
  castingSubmissions as initialSubmissions,
  talentRoster as initialRoster,
  castingCalls as initialCalls,
  billingHistory,
  type CastingSubmission,
  type CastingCall,
  type Artist,
} from '../data'

export type DashboardRole = 'performer' | 'manager'

interface Props {
  navigate: (page: Page, data?: unknown) => void
  role?: DashboardRole
  account?: { name: string; email: string }
}

type Tab = 'overview' | 'profile' | 'casting' | 'roster' | 'calls' | 'billing'

const statusColor = (t: ReturnType<typeof useTheme>['t'], status: CastingSubmission['status']) => {
  if (status === 'Shortlisted') return t.terra
  if (status === 'Reviewed') return t.gold
  if (status === 'Declined') return t.subtle
  return t.mutedFg
}

export default function DashboardPage({ navigate, role = 'performer', account }: Props) {
  const { t } = useTheme()
  const isManager = role === 'manager'

  const demoUser: Artist = isManager
    ? artists.find((a) => a.category === 'Agent') ?? artists[3]
    : artists[0]

  const displayName = account?.name?.trim() || demoUser.name
  const firstName = displayName.split(' ')[0]

  const tabs: { id: Tab; label: string }[] = isManager
    ? [
        { id: 'overview', label: 'Overview' },
        { id: 'profile', label: 'My Profile & Account' },
        { id: 'roster', label: 'My Talent Roster' },
        { id: 'calls', label: 'Casting Calls' },
        { id: 'billing', label: 'Billing' },
      ]
    : [
        { id: 'overview', label: 'Overview' },
        { id: 'profile', label: 'My Profile & Account' },
        { id: 'casting', label: 'Casting Submissions' },
        { id: 'billing', label: 'Billing' },
      ]

  const currentPlan = plans.find((p) => p.id === 'professional') ?? plans[0]

  const [tab, setTab] = useState<Tab>('overview')

  // My Profile & Account
  const [profile, setProfile] = useState({
    name: displayName,
    email: account?.email?.trim() || `${demoUser.name.toLowerCase().replace(/\s+/g, '.')}@rafikihub.com`,
    phone: '+254 700 000 000',
    website: isManager ? '' : `www.${demoUser.name.toLowerCase().replace(/\s+/g, '')}.africa`,
    country: demoUser.country,
  })
  const [savedProfile, setSavedProfile] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwMessage, setPwMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const inputStyle = { background: t.inputBg, border: `1px solid ${t.border}`, color: t.fg, fontFamily: 'var(--font-sans)' }

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault()
    setSavedProfile(true)
    window.setTimeout(() => setSavedProfile(false), 2500)
  }

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

  // Casting Submissions (performer)
  const [submissions, setSubmissions] = useState<CastingSubmission[]>(initialSubmissions)
  const [newSubmission, setNewSubmission] = useState({ title: '', project: '' })
  const [fileName, setFileName] = useState('')

  const handleAddSubmission = (e: FormEvent) => {
    e.preventDefault()
    if (!newSubmission.title || !newSubmission.project) return
    setSubmissions((prev) => [
      { id: `cs-${Date.now()}`, title: newSubmission.title, project: newSubmission.project, submittedDate: 'Just now', status: 'Pending' },
      ...prev,
    ])
    setNewSubmission({ title: '', project: '' })
    setFileName('')
  }

  // My Talent Roster (manager)
  const [roster, setRoster] = useState<Artist[]>(initialRoster)
  const removeFromRoster = (id: string) => setRoster((prev) => prev.filter((a) => a.id !== id))

  // Casting Calls (manager)
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

  const stats = isManager
    ? [
        { label: 'Talent on Roster', value: roster.length },
        { label: 'Open Casting Calls', value: calls.filter((c) => c.status === 'Open').length },
        { label: 'Total Applicants', value: calls.reduce((sum, c) => sum + c.applicants, 0) },
        { label: 'Current Plan', value: currentPlan.name },
      ]
    : [
        { label: 'Submissions Sent', value: submissions.length },
        { label: 'Shortlisted', value: submissions.filter((s) => s.status === 'Shortlisted').length },
        { label: 'Profile Views (30d)', value: 214 },
        { label: 'Current Plan', value: currentPlan.name },
      ]

  const cardStyle = { background: t.card, border: `1px solid ${t.border}`, boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)' }

  return (
    <div style={{ background: t.bg }}>
      <section className="pt-32 pb-10 px-6 md:px-16 lg:px-24 rh-pattern-hero" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
            {isManager ? 'Talent Manager Dashboard' : 'Performer Dashboard'}
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
      </section>

      <section className="py-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-10">
          {/* Sidebar tabs */}
          <div className="lg:col-span-1">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150"
                  style={{
                    background: tab === tb.id ? t.terra : 'transparent',
                    color: tab === tb.id ? '#FFFFFF' : t.fgDim,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {tb.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === 'overview' && (
              <div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-xl p-6" style={cardStyle}>
                      <div className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{s.value}</div>
                      <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Recent Activity</h3>
                <div className="rounded-xl overflow-hidden" style={cardStyle}>
                  {!isManager && submissions.slice(0, 4).map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${t.border}` }}>
                      <div>
                        <div className="text-sm font-medium" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{s.title}</div>
                        <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{s.project} &middot; {s.submittedDate}</div>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: statusColor(t, s.status) }}>{s.status}</span>
                    </div>
                  ))}
                  {isManager && calls.slice(0, 2).map((c, i) => (
                    <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${t.border}` }}>
                      <div>
                        <div className="text-sm font-medium" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{c.title}</div>
                        <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{c.applicants} applicant{c.applicants === 1 ? '' : 's'} &middot; {c.postedDate}</div>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.status === 'Open' ? t.terra : t.subtle }}>{c.status}</span>
                    </div>
                  ))}
                  {isManager && roster.slice(0, 3).map((a, i) => (
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

            {tab === 'profile' && (
              <div className="space-y-10">
                <form onSubmit={handleSaveProfile} className="rounded-2xl p-8 space-y-5" style={cardStyle}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Account Details</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Full Name</label>
                      <input className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Email</label>
                      <input type="email" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Phone</label>
                      <input className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Website</label>
                      <input className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} placeholder="www.yourname.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Country</label>
                      <input className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <button type="submit" className="px-6 py-3 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-105" style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
                      Save Changes
                    </button>
                    {savedProfile && <span className="text-sm font-medium" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Saved!</span>}
                  </div>
                </form>

                <form onSubmit={handleChangePassword} className="rounded-2xl p-8 space-y-5" style={cardStyle}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Change Password</h3>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Current Password</label>
                      <input type="password" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>New Password</label>
                      <input type="password" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Confirm New Password</label>
                      <input type="password" className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <button type="submit" className="px-6 py-3 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-105" style={{ background: t.gold, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
                      Update Password
                    </button>
                    {pwMessage && (
                      <span className="text-sm font-medium" style={{ color: pwMessage.type === 'error' ? '#D64545' : t.terra, fontFamily: 'var(--font-sans)' }}>
                        {pwMessage.text}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {tab === 'roster' && isManager && (
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
                    <div key={a.id} className="rounded-xl overflow-hidden flex" style={cardStyle}>
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

            {tab === 'casting' && !isManager && (
              <div className="space-y-10">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>My Submissions</h3>
                  <div className="rounded-xl overflow-hidden" style={cardStyle}>
                    {submissions.length === 0 && (
                      <p className="text-sm py-10 text-center" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>No casting submissions yet.</p>
                    )}
                    {submissions.map((s, i) => (
                      <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${t.border}` }}>
                        <div>
                          <div className="text-sm font-medium" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{s.title}</div>
                          <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{s.project} &middot; {s.submittedDate}</div>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: statusColor(t, s.status) }}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddSubmission} className="rounded-2xl p-8 space-y-5" style={cardStyle}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Submit for a Casting</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Role / Title</label>
                      <input className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="e.g. Lead Vocalist" value={newSubmission.title} onChange={(e) => setNewSubmission({ ...newSubmission, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Project / Company</label>
                      <input className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="e.g. Baraza Media Lab" value={newSubmission.project} onChange={(e) => setNewSubmission({ ...newSubmission, project: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Self-Tape / Casting Document</label>
                    <label className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm cursor-pointer" style={inputStyle}>
                      <span style={{ color: fileName ? t.fg : t.subtle }}>{fileName || 'Choose a file to attach (optional)'}</span>
                      <span className="text-xs font-semibold uppercase tracking-wide flex-shrink-0" style={{ color: t.terra }}>Browse</span>
                      <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />
                    </label>
                  </div>
                  <button type="submit" className="px-6 py-3 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-105" style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
                    Submit
                  </button>
                </form>
              </div>
            )}

            {tab === 'calls' && isManager && (
              <div className="space-y-10">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Casting Calls</h3>
                  <div className="rounded-xl overflow-hidden" style={cardStyle}>
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

                <form onSubmit={handlePostCall} className="rounded-2xl p-8 space-y-5" style={cardStyle}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Post a New Casting Call</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Role / Title</label>
                      <input className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} placeholder="e.g. Supporting Actor — Feature Film" value={newCall.title} onChange={(e) => setNewCall({ ...newCall, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Looking For</label>
                      <select className="w-full px-4 py-3 rounded-lg text-sm" style={inputStyle} value={newCall.category} onChange={(e) => setNewCall({ ...newCall, category: e.target.value })}>
                        {['Performer', 'Crew', 'Young Performer'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="px-6 py-3 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-105" style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
                    Post Casting Call
                  </button>
                </form>
              </div>
            )}

            {tab === 'billing' && (
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
                  <div className="rounded-xl overflow-hidden" style={cardStyle}>
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
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
