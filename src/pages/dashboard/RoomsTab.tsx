import { useState, type FormEvent } from 'react'
import type { Theme } from '../../theme'
import {
  fullCountryList, facilityTypeOptions, chargeFrequencyOptions, currencyOptions,
  type RoomListingRow, type RoomBookingRow, type RoomBookingRequestRow,
} from '../../data'
import { SectionCard, Field, inputStyle, inputClass, PrimaryButton, RowTable } from './shared'

interface Props {
  t: Theme
  listings: RoomListingRow[]
  onAddListing: (listing: RoomListingRow) => void
  bookings: RoomBookingRow[]
  bookingRequests: RoomBookingRequestRow[]
}

const emptyForm = {
  facilityType: facilityTypeOptions[0],
  country: fullCountryList[0],
  city: '',
  charges: '',
  currency: currencyOptions[0],
  chargeFrequency: chargeFrequencyOptions[0],
  size: '',
  capacity: '',
  hours: '',
  description: '',
}

// ROOMS & STUDIOS — rooms-hire-template.php. Used both as the performer
// dashboard's own "Rooms & Studios" tab and as the primary tab for the
// 'rooms' role (a Rooms & Studio member account).
export default function RoomsTab({ t, listings, onAddListing, bookings, bookingRequests }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.city.trim()) return
    onAddListing({
      id: `rl-${Date.now()}`,
      reference: `RS-${Math.floor(1000 + Math.random() * 9000)}`,
      country: form.country,
      city: form.city,
      type: form.facilityType,
      size: form.size || '—',
    })
    setForm(emptyForm)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit}>
        <SectionCard t={t} title="List Your Facility">
          <div className="grid md:grid-cols-2 gap-5">
            <Field t={t} label="Facility Type">
              <select className={inputClass} style={inputStyle(t)} value={form.facilityType} onChange={(e) => setForm({ ...form, facilityType: e.target.value })}>
                {facilityTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field t={t} label="Location Country">
              <select className={inputClass} style={inputStyle(t)} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                {fullCountryList.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field t={t} label="Location City">
              <input required className={inputClass} style={inputStyle(t)} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field t={t} label="Charges">
                <input type="number" min="0" className={inputClass} style={inputStyle(t)} value={form.charges} onChange={(e) => setForm({ ...form, charges: e.target.value })} />
              </Field>
              <Field t={t} label="Currency">
                <select className={inputClass} style={inputStyle(t)} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                  {currencyOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            </div>
            <Field t={t} label="Charge Frequency">
              <select className={inputClass} style={inputStyle(t)} value={form.chargeFrequency} onChange={(e) => setForm({ ...form, chargeFrequency: e.target.value })}>
                {chargeFrequencyOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field t={t} label="Facility Size">
              <input className={inputClass} style={inputStyle(t)} placeholder="e.g. 80 sqm" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
            </Field>
            <Field t={t} label="Facility Capacity">
              <input type="number" min="0" className={inputClass} style={inputStyle(t)} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            </Field>
            <Field t={t} label="Operating Hours">
              <input className={inputClass} style={inputStyle(t)} placeholder="e.g. 8am – 8pm daily" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
            </Field>
          </div>
          <Field t={t} label="Facility Description">
            <textarea rows={4} className={inputClass} style={inputStyle(t)} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="flex items-center gap-4">
            <PrimaryButton t={t} type="submit">List Facility</PrimaryButton>
            {saved && <span className="text-sm font-medium" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Listed!</span>}
          </div>
        </SectionCard>
      </form>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>My Listings</h3>
        <RowTable
          t={t}
          rows={listings}
          emptyMessage="You haven't listed a facility yet."
          columns={[
            { key: 'reference', label: 'Reference' },
            { key: 'country', label: 'Country' },
            { key: 'city', label: 'City' },
            { key: 'type', label: 'Type' },
            { key: 'size', label: 'Size' },
          ]}
        />
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>My Bookings</h3>
        <RowTable
          t={t}
          rows={bookings}
          emptyMessage="No bookings yet."
          columns={[
            { key: 'reference', label: 'Reference' },
            { key: 'country', label: 'Country' },
            { key: 'city', label: 'City' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status', isStatus: true },
          ]}
        />
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Booking Requests</h3>
        <RowTable
          t={t}
          rows={bookingRequests}
          emptyMessage="No booking requests yet."
          columns={[
            { key: 'reference', label: 'Reference' },
            { key: 'fullName', label: 'Full Name' },
            { key: 'mobile', label: 'Mobile' },
            { key: 'status', label: 'Status', isStatus: true },
          ]}
        />
      </div>
    </div>
  )
}
