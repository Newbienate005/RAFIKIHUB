import { useState, type FormEvent } from 'react'
import type { Theme } from '../../theme'
import { SectionCard, Field, inputStyle, inputClass, PrimaryButton } from './shared'

export interface AccountDetails {
  name: string
  email: string
  phone: string
  website: string
  country: string
}

interface Props {
  t: Theme
  account: AccountDetails
  setAccount: (account: AccountDetails) => void
}

// "My Profile & Account" — used by the casting / crew / pet / rooms
// dashboards (the performer role covers this ground inside Edit CV's
// General pill instead, since that's where the real site puts it for
// performers).
export default function AccountTab({ t, account, setAccount }: Props) {
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof AccountDetails>(key: K, value: AccountDetails[K]) => setAccount({ ...account, [key]: value })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit}>
      <SectionCard t={t} title="Account Details">
        <div className="grid md:grid-cols-2 gap-5">
          <Field t={t} label="Full Name">
            <input className={inputClass} style={inputStyle(t)} value={account.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field t={t} label="Email">
            <input type="email" className={inputClass} style={inputStyle(t)} value={account.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <Field t={t} label="Phone">
            <input className={inputClass} style={inputStyle(t)} value={account.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field t={t} label="Website">
            <input className={inputClass} style={inputStyle(t)} value={account.website} onChange={(e) => set('website', e.target.value)} placeholder="www.yourname.com" />
          </Field>
          <Field t={t} label="Country">
            <input className={inputClass} style={inputStyle(t)} value={account.country} onChange={(e) => set('country', e.target.value)} />
          </Field>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <PrimaryButton t={t} type="submit">Save Changes</PrimaryButton>
          {saved && <span className="text-sm font-medium" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Saved!</span>}
        </div>
      </SectionCard>
    </form>
  )
}
