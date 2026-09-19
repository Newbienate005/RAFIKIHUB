import { useState } from 'react'
import type { Page } from '../../App'
import type { Theme } from '../../theme'
import { plans, billingHistory, roomListingsTable, roomBookingsTable, roomBookingRequestsTable, type RoomListingRow } from '../../data'
import { cardStyle } from './shared'
import AccountTab, { type AccountDetails } from './AccountTab'
import BillingTab from './BillingTab'
import RoomsTab from './RoomsTab'

interface Props {
  t: Theme
  navigate: (page: Page, data?: unknown) => void
  account?: { name: string; email: string }
}

type Tab = 'overview' | 'account' | 'rooms' | 'billing'

// Rooms & Studio member — rooms-body.php. Overview / Profile & Account /
// Rooms & Studios (the same facility-listing tool the performer dashboard
// offers, since it's this role's primary purpose) / Billing.
export default function RoomsDashboard({ t, navigate, account }: Props) {
  const [tab, setTab] = useState<Tab>('overview')

  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    name: account?.name?.trim() || 'Studio Owner',
    email: account?.email?.trim() || 'studio@rafikihub.com',
    phone: '',
    website: '',
    country: '',
  })

  const [listings, setListings] = useState<RoomListingRow[]>(roomListingsTable)
  const handleAddListing = (listing: RoomListingRow) => setListings((prev) => [...prev, listing])

  const currentPlan = plans[0]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'account', label: 'My Profile & Account' },
    { id: 'rooms', label: 'Rooms & Studios' },
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
            <div className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{listings.length}</div>
            <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Facilities Listed</div>
          </div>
          <div className="rounded-xl p-6" style={cardStyle(t)}>
            <div className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: t.fg }}>{currentPlan.name}</div>
            <div className="text-xs" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Current Plan</div>
          </div>
        </div>
      )}

      {tab === 'account' && <AccountTab t={t} account={accountDetails} setAccount={setAccountDetails} />}

      {tab === 'rooms' && (
        <RoomsTab t={t} listings={listings} onAddListing={handleAddListing} bookings={roomBookingsTable} bookingRequests={roomBookingRequestsTable} />
      )}

      {tab === 'billing' && <BillingTab t={t} navigate={navigate} currentPlan={currentPlan} billingHistory={billingHistory} />}
    </div>
  )
}
