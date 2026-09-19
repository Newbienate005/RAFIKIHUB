import { useState, type FormEvent } from 'react'
import type { Theme } from '../../theme'
import type { InvoiceRow, InvoiceLineItem, AgentRow } from '../../data'
import { SectionCard, Field, inputStyle, inputClass, PrimaryButton, RowTable, PillTabs } from './shared'

interface Props {
  t: Theme
  invoices: InvoiceRow[]
  onAddInvoice: (invoice: InvoiceRow) => void
  calendar: AgentRow[]
}

type Pill = 'invoices' | 'calendar'

const emptyInvoiceForm = {
  invoiceName: '', invoiceNumber: '', invoiceDate: '',
  myAddress: '', myCity: '', myCountry: '', tin: '',
  billToName: '', billToAddress: '', billToCity: '', billToCountry: '',
}

// TOOLBOX — Invoice Generator (dashboard/index.php's toolbox pill) and
// My Calendar. Kept as one tab with two sub-pills so everything stays
// reachable without crowding the top-level nav.
export default function ToolboxTab({ t, invoices, onAddInvoice, calendar }: Props) {
  const [pill, setPill] = useState<Pill>('invoices')
  const [form, setForm] = useState(emptyInvoiceForm)
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([{ id: 'li-1', description: '', amount: 0 }])
  const [generated, setGenerated] = useState(false)

  const total = lineItems.reduce((sum, li) => sum + (Number.isFinite(li.amount) ? li.amount : 0), 0)

  const addLineItem = () => setLineItems((prev) => [...prev, { id: `li-${Date.now()}`, description: '', amount: 0 }])
  const removeLineItem = (id: string) => setLineItems((prev) => prev.filter((li) => li.id !== id))
  const updateLineItem = (id: string, patch: Partial<InvoiceLineItem>) =>
    setLineItems((prev) => prev.map((li) => (li.id === id ? { ...li, ...patch } : li)))

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault()
    if (!form.invoiceName.trim() || !form.invoiceNumber.trim()) return
    onAddInvoice({
      id: `inv-${Date.now()}`,
      invoiceName: form.invoiceName,
      invoiceNumber: form.invoiceNumber,
      invoiceDate: form.invoiceDate || new Date().toLocaleDateString(),
      status: 'Draft',
    })
    setGenerated(true)
    window.setTimeout(() => setGenerated(false), 2500)
  }

  return (
    <div>
      <PillTabs t={t} active={pill} onChange={setPill} tabs={[{ id: 'invoices', label: 'Invoices' }, { id: 'calendar', label: 'Calendar' }]} />

      {pill === 'invoices' && (
        <div className="space-y-10">
          <form onSubmit={handleGenerate}>
            <SectionCard t={t} title="Invoice Generator">
              <p className="text-xs -mt-2" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>
                The real site generates an actual PDF invoice server-side (via mPDF) — that's out of scope for a
                static frontend, so &ldquo;Generate Invoice&rdquo; here just adds a draft row below.
              </p>
              <div className="grid md:grid-cols-3 gap-5">
                <Field t={t} label="Invoice Name">
                  <input required className={inputClass} style={inputStyle(t)} value={form.invoiceName} onChange={(e) => setForm({ ...form, invoiceName: e.target.value })} />
                </Field>
                <Field t={t} label="Invoice Number">
                  <input required className={inputClass} style={inputStyle(t)} value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} />
                </Field>
                <Field t={t} label="Invoice Date">
                  <input type="date" className={inputClass} style={inputStyle(t)} value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />
                </Field>
              </div>

              <fieldset className="grid md:grid-cols-3 gap-5 pt-2 border-t" style={{ borderColor: t.border }}>
                <legend className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>My Details</legend>
                <Field t={t} label="My Address"><input className={inputClass} style={inputStyle(t)} value={form.myAddress} onChange={(e) => setForm({ ...form, myAddress: e.target.value })} /></Field>
                <Field t={t} label="My City"><input className={inputClass} style={inputStyle(t)} value={form.myCity} onChange={(e) => setForm({ ...form, myCity: e.target.value })} /></Field>
                <Field t={t} label="My Country"><input className={inputClass} style={inputStyle(t)} value={form.myCountry} onChange={(e) => setForm({ ...form, myCountry: e.target.value })} /></Field>
                <Field t={t} label="Tax Identification Number (TIN)"><input className={inputClass} style={inputStyle(t)} value={form.tin} onChange={(e) => setForm({ ...form, tin: e.target.value })} /></Field>
              </fieldset>

              <fieldset className="grid md:grid-cols-2 gap-5 pt-2 border-t" style={{ borderColor: t.border }}>
                <legend className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Bill To</legend>
                <Field t={t} label="Name"><input className={inputClass} style={inputStyle(t)} value={form.billToName} onChange={(e) => setForm({ ...form, billToName: e.target.value })} /></Field>
                <Field t={t} label="Address"><input className={inputClass} style={inputStyle(t)} value={form.billToAddress} onChange={(e) => setForm({ ...form, billToAddress: e.target.value })} /></Field>
                <Field t={t} label="City"><input className={inputClass} style={inputStyle(t)} value={form.billToCity} onChange={(e) => setForm({ ...form, billToCity: e.target.value })} /></Field>
                <Field t={t} label="Country"><input className={inputClass} style={inputStyle(t)} value={form.billToCountry} onChange={(e) => setForm({ ...form, billToCountry: e.target.value })} /></Field>
              </fieldset>

              <div className="pt-2 border-t space-y-3" style={{ borderColor: t.border }}>
                <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Line Items</h4>
                {lineItems.map((li) => (
                  <div key={li.id} className="flex flex-wrap items-center gap-3">
                    <input
                      className="flex-1 min-w-[180px] px-4 py-2.5 rounded-lg text-sm"
                      style={inputStyle(t)}
                      placeholder="Description"
                      value={li.description}
                      onChange={(e) => updateLineItem(li.id, { description: e.target.value })}
                    />
                    <input
                      type="number"
                      min="0"
                      className="w-32 px-4 py-2.5 rounded-lg text-sm"
                      style={inputStyle(t)}
                      placeholder="Amount"
                      value={li.amount || ''}
                      onChange={(e) => updateLineItem(li.id, { amount: Number(e.target.value) })}
                    />
                    <button type="button" onClick={() => removeLineItem(li.id)} className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#D64545' }}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addLineItem} className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>+ Add Line Item</button>
                <div className="flex justify-end pt-2 border-t" style={{ borderColor: t.border }}>
                  <span className="text-sm font-semibold" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>Total: {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <PrimaryButton t={t} type="submit">Generate Invoice</PrimaryButton>
                {generated && <span className="text-sm font-medium" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Draft added below!</span>}
              </div>
            </SectionCard>
          </form>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>My Invoices</h3>
            <RowTable
              t={t}
              rows={invoices}
              emptyMessage="No invoices yet."
              columns={[
                { key: 'invoiceName', label: 'Invoice Name' },
                { key: 'invoiceNumber', label: 'Invoice Number' },
                { key: 'invoiceDate', label: 'Invoice Date' },
                { key: 'status', label: 'Status', isStatus: true },
              ]}
            />
          </div>
        </div>
      )}

      {pill === 'calendar' && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>My Calendar</h3>
          {/* Real-site quirk, preserved on purpose: My Calendar reuses My Agents'
              exact table columns (AGENT NAME / AGENT EMAIL / AGENT COUNTRY / STATUS)
              in production rather than a real calendar view. */}
          <RowTable
            t={t}
            rows={calendar}
            emptyMessage="Nothing on your calendar yet."
            columns={[
              { key: 'agentName', label: 'Agent Name' },
              { key: 'agentEmail', label: 'Agent Email' },
              { key: 'agentCountry', label: 'Agent Country' },
              { key: 'status', label: 'Status', isStatus: true },
            ]}
          />
        </div>
      )}
    </div>
  )
}
