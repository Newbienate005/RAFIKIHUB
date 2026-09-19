import type { ReactNode } from 'react'
import type { Theme } from '../../theme'
import type { DocStatus } from '../../data'

// Shared style/UI helpers for the dashboard + profile sub-pages, kept in one
// place so every split-out tab file (HomeTab, EditCvTab, OpportunitiesTab,
// etc.) stays consistent with the rest of the app's inline-Tailwind +
// useTheme() convention without repeating boilerplate in every file.

export const inputStyle = (t: Theme) => ({
  background: t.inputBg,
  border: `1px solid ${t.border}`,
  color: t.fg,
  fontFamily: 'var(--font-sans)',
})

export const cardStyle = (t: Theme) => ({
  background: t.card,
  border: `1px solid ${t.border}`,
  boxShadow: t.isDark ? '5px 5px 0 rgba(0,0,0,0.4)' : '5px 5px 0 rgba(28,45,65,0.10)',
})

export const labelClass = 'block text-xs font-semibold uppercase tracking-wide mb-2'
export const labelStyle = (t: Theme) => ({ color: t.mutedFg, fontFamily: 'var(--font-sans)' })

export const inputClass = 'w-full px-4 py-3 rounded-lg text-sm'

// Generic status → color mapping across every status enum used by the
// dashboard mock tables (CastingPosting/status, AgentRow/status,
// InvoiceRow/status, RoomBookingRow/status, DocStatus, etc).
export function statusColor(t: Theme, status: string): string {
  switch (status) {
    case 'Open':
    case 'Active':
    case 'Paid':
    case 'Confirmed':
    case 'Approved':
    case 'Shortlisted':
      return t.terra
    case 'Pending':
    case 'Draft':
    case 'Under Review':
    case 'Applied':
      return t.gold
    case 'Declined':
    case 'Rejected':
    case 'Unpaid':
      return '#D64545'
    case 'Closed':
    case 'Not Uploaded':
      return t.subtle
    default:
      return t.mutedFg
  }
}

export function Eyebrow({ t, children }: { t: Theme; children: ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>
      {children}
    </span>
  )
}

export function SectionCard({ t, title, children, className = '' }: { t: Theme; title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-6 md:p-8 space-y-5 ${className}`} style={cardStyle(t)}>
      {title && (
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>{title}</h3>
      )}
      {children}
    </div>
  )
}

export function Field({ t, label, children, hint }: { t: Theme; label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className={labelClass} style={labelStyle(t)}>{label}</label>
      {children}
      {hint && <p className="text-[11px] mt-1.5" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{hint}</p>}
    </div>
  )
}

export function DocStatusBadge({ t, status }: { t: Theme; status: DocStatus }) {
  const color = statusColor(t, status)
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full inline-block flex-shrink-0"
      style={{ color, background: t.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)', border: `1px solid ${color}66`, fontFamily: 'var(--font-sans)' }}
    >
      {status}
    </span>
  )
}

export function FileInputField({
  t, fileName, onChange, placeholder = 'Choose a file to upload',
}: {
  t: Theme
  fileName: string
  onChange: (name: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm cursor-pointer" style={inputStyle(t)}>
      <span className="truncate" style={{ color: fileName ? t.fg : t.subtle }}>{fileName || placeholder}</span>
      <span className="text-xs font-semibold uppercase tracking-wide flex-shrink-0" style={{ color: t.terra }}>Browse</span>
      <input type="file" className="hidden" onChange={(e) => onChange(e.target.files?.[0]?.name ?? '')} />
    </label>
  )
}

export function TagChips({ t, items, onRemove }: { t: Theme; items: string[]; onRemove: (index: number) => void }) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-2"
          style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}
        >
          {item}
          <button type="button" onClick={() => onRemove(i)} aria-label={`Remove ${item}`} style={{ color: t.terra, lineHeight: 1 }}>×</button>
        </span>
      ))}
    </div>
  )
}

export function PillTabs<T extends string>({
  t, tabs, active, onChange,
}: {
  t: Theme
  tabs: { id: T; label: string }[]
  active: T
  onChange: (id: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((tb) => (
        <button
          key={tb.id}
          type="button"
          onClick={() => onChange(tb.id)}
          className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors duration-150"
          style={{
            background: active === tb.id ? t.terra : 'transparent',
            color: active === tb.id ? '#FFFFFF' : t.fgDim,
            border: `1px solid ${active === tb.id ? t.terra : t.border}`,
            fontFamily: 'var(--font-sans)',
          }}
        >
          {tb.label}
        </button>
      ))}
    </div>
  )
}

interface Column<T> {
  key: keyof T
  label: string
  isStatus?: boolean
  render?: (row: T) => ReactNode
}

// A styled row-list "table" — matches the existing bordered-row-list
// convention used throughout the app instead of literal <table> markup.
export function RowTable<T extends { id: string }>({
  t, columns, rows, emptyMessage = 'Nothing here yet.', renderActions,
}: {
  t: Theme
  columns: Column<T>[]
  rows: T[]
  emptyMessage?: string
  renderActions?: (row: T) => ReactNode
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={cardStyle(t)}>
      {rows.length === 0 && (
        <p className="text-sm py-10 text-center px-5" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>{emptyMessage}</p>
      )}
      {rows.map((row, i) => (
        <div
          key={row.id}
          className="flex flex-wrap items-center gap-x-8 gap-y-2 px-5 py-4"
          style={{ borderTop: i === 0 ? 'none' : `1px solid ${t.border}` }}
        >
          {columns.map((col) => (
            <div key={String(col.key)} className="min-w-[110px]">
              <div className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{col.label}</div>
              <div
                className={col.isStatus ? 'text-xs font-semibold uppercase tracking-wide' : 'text-sm font-medium'}
                style={{ color: col.isStatus ? statusColor(t, String(row[col.key])) : t.fg, fontFamily: 'var(--font-sans)' }}
              >
                {col.render ? col.render(row) : String(row[col.key] ?? '—')}
              </div>
            </div>
          ))}
          {renderActions && <div className="ml-auto flex items-center gap-3 flex-shrink-0">{renderActions(row)}</div>}
        </div>
      ))}
    </div>
  )
}

export function PrimaryButton({ t, children, ...props }: { t: Theme; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { style, className, ...rest } = props
  return (
    <button
      className={`px-6 py-3 rounded-md font-semibold text-sm transition-transform duration-150 hover:scale-105 ${className ?? ''}`}
      style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ t, children, ...props }: { t: Theme; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { style, className, ...rest } = props
  return (
    <button
      className={`px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-wide transition-colors duration-150 ${className ?? ''}`}
      style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.fgDim, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {children}
    </button>
  )
}
