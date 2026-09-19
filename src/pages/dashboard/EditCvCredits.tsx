import { useState } from 'react'
import type { Theme } from '../../theme'
import type { CvProfile, CreditRecord } from '../../data'
import { SectionCard, Field, inputStyle, inputClass, PrimaryButton, RowTable } from './shared'

interface Props {
  t: Theme
  cv: CvProfile
  setCv: (cv: CvProfile) => void
}

const emptyDraft: Omit<CreditRecord, 'id'> = { title: '', type: '', productionYear: '', role: '', productionCompany: '', director: '' }

export default function EditCvCredits({ t, cv, setCv }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [adding, setAdding] = useState(false)

  const startEdit = (credit: CreditRecord) => {
    setEditingId(credit.id)
    setAdding(false)
    const { id: _id, ...rest } = credit
    setDraft(rest)
  }

  const startAdd = () => {
    setAdding(true)
    setEditingId(null)
    setDraft(emptyDraft)
  }

  const cancel = () => {
    setEditingId(null)
    setAdding(false)
    setDraft(emptyDraft)
  }

  const save = () => {
    if (!draft.title.trim()) return
    if (editingId) {
      setCv({ ...cv, credits: cv.credits.map((c) => (c.id === editingId ? { id: editingId, ...draft } : c)) })
    } else {
      setCv({ ...cv, credits: [...cv.credits, { id: `cr-${Date.now()}`, ...draft }] })
    }
    cancel()
  }

  const removeCredit = (id: string) => {
    setCv({ ...cv, credits: cv.credits.filter((c) => c.id !== id) })
    if (editingId === id) cancel()
  }

  const isFormOpen = adding || editingId !== null

  return (
    <div className="space-y-6">
      <RowTable
        t={t}
        rows={cv.credits}
        emptyMessage="No credits added yet."
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'type', label: 'Type' },
          { key: 'role', label: 'Role' },
          { key: 'productionCompany', label: 'Production Company' },
        ]}
        renderActions={(row) => (
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => startEdit(row)} className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Edit</button>
            <button type="button" onClick={() => removeCredit(row.id)} className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#D64545' }}>Remove</button>
          </div>
        )}
      />

      {!isFormOpen && (
        <button
          type="button"
          onClick={startAdd}
          className="px-6 py-3 rounded-md font-semibold text-sm"
          style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}
        >
          + Add Credit
        </button>
      )}

      {isFormOpen && (
        <SectionCard t={t} title={editingId ? 'Edit Credit' : 'Add Credit'}>
          <div className="grid md:grid-cols-2 gap-5">
            <Field t={t} label="Casting Title">
              <input className={inputClass} style={inputStyle(t)} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field t={t} label="Casting Type">
              <input className={inputClass} style={inputStyle(t)} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} />
            </Field>
            <Field t={t} label="Production Year">
              <input className={inputClass} style={inputStyle(t)} value={draft.productionYear} onChange={(e) => setDraft({ ...draft, productionYear: e.target.value })} />
            </Field>
            <Field t={t} label="Role">
              <input className={inputClass} style={inputStyle(t)} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
            </Field>
            <Field t={t} label="Production Company">
              <input className={inputClass} style={inputStyle(t)} value={draft.productionCompany} onChange={(e) => setDraft({ ...draft, productionCompany: e.target.value })} />
            </Field>
            <Field t={t} label="Director">
              <input className={inputClass} style={inputStyle(t)} value={draft.director} onChange={(e) => setDraft({ ...draft, director: e.target.value })} />
            </Field>
          </div>
          <div className="flex items-center gap-4">
            <PrimaryButton t={t} type="button" onClick={save}>{editingId ? 'Save Credit' : 'Add Credit'}</PrimaryButton>
            <button type="button" onClick={cancel} className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Cancel</button>
          </div>
        </SectionCard>
      )}
    </div>
  )
}
