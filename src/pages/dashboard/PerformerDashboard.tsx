import { useState } from 'react'
import type { Page } from '../../App'
import type { Theme } from '../../theme'
import {
  demoCvProfile, auditionsTable, myApplicationsTable, myAgentsTable, myCalendarTable,
  roomListingsTable, roomBookingsTable, roomBookingRequestsTable, myInvoicesTable,
  plans, billingHistory,
  type CvProfile, type CastingPosting, type AgentRow, type RoomListingRow, type InvoiceRow,
} from '../../data'
import HomeTab from './HomeTab'
import EditCvTab from './EditCvTab'
import OpportunitiesTab from './OpportunitiesTab'
import MyAgentsTab from './MyAgentsTab'
import MyMediaTab from './MyMediaTab'
import RoomsTab from './RoomsTab'
import ToolboxTab from './ToolboxTab'
import ResourceHubTab from './ResourceHubTab'
import BillingTab from './BillingTab'

interface Props {
  t: Theme
  navigate: (page: Page, data?: unknown) => void
  account?: { name: string; email: string }
}

type Tab = 'home' | 'editcv' | 'opportunities' | 'agents' | 'media' | 'rooms' | 'toolbox' | 'resources' | 'billing'

// Omit-based, not a plain intersection — see OpportunitiesTab.tsx for why.
type Application = Omit<CastingPosting, 'status'> & { status: 'Applied' | 'Shortlisted' | 'Declined' }

export default function PerformerDashboard({ t, navigate, account }: Props) {
  const [tab, setTab] = useState<Tab>('home')

  const [cv, setCv] = useState<CvProfile>(() => ({
    ...demoCvProfile,
    name: account?.name?.trim() || demoCvProfile.name,
    email: account?.email?.trim() || demoCvProfile.email,
  }))

  const [applications, setApplications] = useState<Application[]>(myApplicationsTable)
  const handleApply = (posting: CastingPosting) => {
    setApplications((prev) => [...prev, { ...posting, id: `ap-${Date.now()}`, status: 'Applied' }])
  }

  const [agents, setAgents] = useState<AgentRow[]>(myAgentsTable)
  const handleInviteAgent = (agent: { agentEmail: string; agentName: string }) => {
    setAgents((prev) => [...prev, { id: `ag-${Date.now()}`, agentName: agent.agentName, agentEmail: agent.agentEmail, agentCountry: '—', status: 'Pending' }])
  }

  const [media, setMedia] = useState({ photos: [] as string[], showreelFile: '', voiceoverFile: '' })

  const [roomListings, setRoomListings] = useState<RoomListingRow[]>(roomListingsTable)
  const handleAddListing = (listing: RoomListingRow) => setRoomListings((prev) => [...prev, listing])

  const [invoices, setInvoices] = useState<InvoiceRow[]>(myInvoicesTable)
  const handleAddInvoice = (invoice: InvoiceRow) => setInvoices((prev) => [...prev, invoice])

  const currentPlan = plans.find((p) => p.id === 'professional') ?? plans[0]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'editcv', label: 'Edit CV' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'agents', label: 'My Agents' },
    { id: 'media', label: 'My Media' },
    { id: 'rooms', label: 'Rooms & Studios' },
    { id: 'toolbox', label: 'Toolbox' },
    { id: 'resources', label: 'Resource Hub' },
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

      {tab === 'home' && <HomeTab t={t} navigate={navigate} cv={cv} />}
      {tab === 'editcv' && <EditCvTab t={t} cv={cv} setCv={setCv} />}
      {tab === 'opportunities' && <OpportunitiesTab t={t} postings={auditionsTable} applications={applications} onApply={handleApply} />}
      {tab === 'agents' && <MyAgentsTab t={t} agents={agents} onInvite={handleInviteAgent} />}
      {tab === 'media' && <MyMediaTab t={t} media={media} setMedia={setMedia} />}
      {tab === 'rooms' && (
        <RoomsTab t={t} listings={roomListings} onAddListing={handleAddListing} bookings={roomBookingsTable} bookingRequests={roomBookingRequestsTable} />
      )}
      {tab === 'toolbox' && <ToolboxTab t={t} invoices={invoices} onAddInvoice={handleAddInvoice} calendar={myCalendarTable} />}
      {tab === 'resources' && <ResourceHubTab t={t} navigate={navigate} />}
      {tab === 'billing' && <BillingTab t={t} navigate={navigate} currentPlan={currentPlan} billingHistory={billingHistory} />}
    </div>
  )
}
