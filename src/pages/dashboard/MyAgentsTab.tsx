import { useState, type FormEvent } from 'react'
import type { Theme } from '../../theme'
import type { AgentRow } from '../../data'
import { RowTable, SectionCard, Field, inputStyle, inputClass, PrimaryButton } from './shared'

interface Props {
  t: Theme
  agents: AgentRow[]
  onInvite: (agent: { agentEmail: string; agentName: string }) => void
}

export default function MyAgentsTab({ t, agents, onInvite }: Props) {
  const [form, setForm] = useState({ agentEmail: '', agentName: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.agentEmail.trim() || !form.agentName.trim()) return
    onInvite({ agentEmail: form.agentEmail, agentName: form.agentName })
    setForm({ agentEmail: '', agentName: '', subject: '', message: '' })
    setSent(true)
    window.setTimeout(() => setSent(false), 2500)
  }

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>My Agents</h3>
        <RowTable
          t={t}
          rows={agents}
          emptyMessage="You haven't linked any agents yet."
          columns={[
            { key: 'agentName', label: 'Agent Name' },
            { key: 'agentEmail', label: 'Agent Email' },
            { key: 'agentCountry', label: 'Agent Country' },
            { key: 'status', label: 'Status', isStatus: true },
          ]}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <SectionCard t={t} title="Invite Agent">
          <div className="grid md:grid-cols-2 gap-5">
            <Field t={t} label="Agent Email Address">
              <input required type="email" className={inputClass} style={inputStyle(t)} value={form.agentEmail} onChange={(e) => setForm({ ...form, agentEmail: e.target.value })} />
            </Field>
            <Field t={t} label="Agent Name">
              <input required className={inputClass} style={inputStyle(t)} value={form.agentName} onChange={(e) => setForm({ ...form, agentName: e.target.value })} />
            </Field>
            <Field t={t} label="Email Subject">
              <input className={inputClass} style={inputStyle(t)} placeholder="Representation Request" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </Field>
          </div>
          <Field t={t} label="Email Message">
            <textarea rows={3} className={inputClass} style={inputStyle(t)} placeholder="Hi, I'd love for you to represent me on RafikiHub..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </Field>
          <div className="flex items-center gap-4">
            <PrimaryButton t={t} type="submit">Send Invite</PrimaryButton>
            {sent && <span className="text-sm font-medium" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Invite sent!</span>}
          </div>
        </SectionCard>
      </form>
    </div>
  )
}
