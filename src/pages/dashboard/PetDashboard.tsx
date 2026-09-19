import { useState, type FormEvent } from 'react'
import type { Page } from '../../App'
import type { Theme } from '../../theme'
import { plans, billingHistory } from '../../data'
import { cardStyle, SectionCard, Field, inputStyle, inputClass, PrimaryButton, FileInputField } from './shared'
import AccountTab, { type AccountDetails } from './AccountTab'
import BillingTab from './BillingTab'

interface Props {
  t: Theme
  navigate: (page: Page, data?: unknown) => void
  account?: { name: string; email: string }
}

type Tab = 'overview' | 'account' | 'pet' | 'billing'

interface PetProfile {
  name: string
  species: string
  breed: string
  age: string
  tricks: string
}

// Pet — pets-body.php on the real site is a light single-form dashboard:
// Overview / Profile & Account / Pet Profile / Billing.
export default function PetDashboard({ t, navigate, account }: Props) {
  const [tab, setTab] = useState<Tab>('overview')

  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    name: account?.name?.trim() || 'Pet Owner',
    email: account?.email?.trim() || 'owner@rafikihub.com',
    phone: '',
    website: '',
    country: '',
  })

  const [pet, setPet] = useState<PetProfile>({ name: '', species: '', breed: '', age: '', tricks: '' })
  const [photoName, setPhotoName] = useState('')
  const [saved, setSaved] = useState(false)

  const currentPlan = plans[0]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'account', label: 'My Profile & Account' },
    { id: 'pet', label: 'Pet Profile' },
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
            <div className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{pet.name ? 1 : 0}</div>
            <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Pet Profiles</div>
          </div>
          <div className="rounded-xl p-6" style={cardStyle(t)}>
            <div className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{currentPlan.name}</div>
            <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Current Plan</div>
          </div>
        </div>
      )}

      {tab === 'account' && <AccountTab t={t} account={accountDetails} setAccount={setAccountDetails} />}

      {tab === 'pet' && (
        <form onSubmit={handleSubmit}>
          <SectionCard t={t} title="Pet Profile">
            <div className="grid md:grid-cols-2 gap-5">
              <Field t={t} label="Name">
                <input className={inputClass} style={inputStyle(t)} value={pet.name} onChange={(e) => setPet({ ...pet, name: e.target.value })} />
              </Field>
              <Field t={t} label="Species">
                <input className={inputClass} style={inputStyle(t)} placeholder="e.g. Dog, Horse, Parrot" value={pet.species} onChange={(e) => setPet({ ...pet, species: e.target.value })} />
              </Field>
              <Field t={t} label="Breed">
                <input className={inputClass} style={inputStyle(t)} value={pet.breed} onChange={(e) => setPet({ ...pet, breed: e.target.value })} />
              </Field>
              <Field t={t} label="Age">
                <input className={inputClass} style={inputStyle(t)} value={pet.age} onChange={(e) => setPet({ ...pet, age: e.target.value })} />
              </Field>
            </div>
            <Field t={t} label="Tricks & Abilities">
              <textarea rows={4} className={inputClass} style={inputStyle(t)} value={pet.tricks} onChange={(e) => setPet({ ...pet, tricks: e.target.value })} />
            </Field>
            <Field t={t} label="Photo">
              <FileInputField t={t} fileName={photoName} onChange={setPhotoName} placeholder="Upload a photo" />
            </Field>
            <div className="flex items-center gap-4">
              <PrimaryButton t={t} type="submit">Save Pet Profile</PrimaryButton>
              {saved && <span className="text-sm font-medium" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Saved!</span>}
            </div>
          </SectionCard>
        </form>
      )}

      {tab === 'billing' && <BillingTab t={t} navigate={navigate} currentPlan={currentPlan} billingHistory={billingHistory} />}
    </div>
  )
}
