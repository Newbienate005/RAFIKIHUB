import type { Theme } from '../../theme'
import type { CastingPosting } from '../../data'
import { RowTable } from './shared'

// Built with Omit rather than a plain intersection: CastingPosting's own
// `status` union ('Open'|'Closed'|'Under Review') would otherwise collide
// with this one and collapse the whole type to `never`.
type Application = Omit<CastingPosting, 'status'> & { status: 'Applied' | 'Shortlisted' | 'Declined' }

interface Props {
  t: Theme
  postings: CastingPosting[]
  applications: Application[]
  onApply: (posting: CastingPosting) => void
}

// Performer OPPORTUNITIES tab — "Talent Postings" (auditionsTable) and
// "Applied Talents" (myApplicationsTable) from dashboard/index.php.
export default function OpportunitiesTab({ t, postings, applications, onApply }: Props) {
  const appliedRefs = new Set(applications.map((a) => a.reference))

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Talent Postings</h3>
        <RowTable
          t={t}
          rows={postings}
          emptyMessage="No open castings right now — check back soon."
          columns={[
            { key: 'reference', label: 'Reference' },
            { key: 'castingTitle', label: 'Casting Title' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status', isStatus: true },
          ]}
          renderActions={(row) => (
            <button
              type="button"
              disabled={row.status !== 'Open' || appliedRefs.has(row.reference)}
              onClick={() => onApply(row)}
              className="text-xs font-semibold uppercase tracking-wide disabled:opacity-40"
              style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}
            >
              {appliedRefs.has(row.reference) ? 'Applied' : 'Apply'}
            </button>
          )}
        />
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Applied Talents</h3>
        <RowTable
          t={t}
          rows={applications}
          emptyMessage="You haven't applied to any castings yet."
          columns={[
            { key: 'reference', label: 'Reference' },
            { key: 'castingTitle', label: 'Casting Title' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status', isStatus: true },
          ]}
        />
      </div>
    </div>
  )
}
