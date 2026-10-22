import { AdminForm } from "@/components/admin/AdminForm";
import { updateMyDetails } from "@/app/dashboard/details-actions";
import { countries } from "@/lib/countries";

type Props = { name: string; email: string; phone: string | null; country: string | null; saved?: boolean };

/** "Your details" on the dashboards, editable by the member. Email changes go through the RafikiHub team. */
export function MyDetailsForm({ name, email, phone, country, saved }: Props) {
  return (
    <>
      {saved ? <p className="form-success" role="status">Saved.</p> : null}
      <AdminForm action={updateMyDetails} labels={{ name: "Full name", phone: "Phone", country: "Country" }} submitLabel="Save my details" className="admin-form my-details">
        <div className="field">
          <label htmlFor="md-name">Full name</label>
          <input id="md-name" name="name" defaultValue={name} required autoComplete="name" />
        </div>
        <div className="field">
          <span className="field__label">Email</span>
          <p className="small">{email}. To change it, email info@rafikihub.com.</p>
        </div>
        <div className="field">
          <label htmlFor="md-phone">Phone</label>
          <input id="md-phone" name="phone" type="tel" defaultValue={phone ?? ""} required autoComplete="tel" aria-describedby="md-phone-hint" />
          <p id="md-phone-hint" className="hint">Include the country code, e.g. +254</p>
        </div>
        <div className="field">
          <label htmlFor="md-country">Country</label>
          <select id="md-country" name="country" defaultValue={country && (countries as readonly string[]).includes(country) ? country : "Kenya"} autoComplete="country-name">
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </AdminForm>
    </>
  );
}
