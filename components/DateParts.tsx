"use client";

import { useState } from "react";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * A date picked as Day / Month / Year: quicker than a calendar for a birth date decades back, and it looks the
 * same in every browser. Submits one yyyy-mm-dd value under `name` (empty until all three are chosen).
 */
export function DateParts({ id, name, invalid, describedBy, required }: { id: string; name: string; invalid?: boolean; describedBy?: string; required?: boolean }) {
  const [d, setD] = useState("");
  const [m, setM] = useState("");
  const [y, setY] = useState("");
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(thisYear - i));
  const days = y && m ? new Date(Number(y), Number(m), 0).getDate() : 31; // no 31 February
  const day = d && Number(d) > days ? "" : d;
  const value = day && m && y ? `${y}-${m.padStart(2, "0")}-${day.padStart(2, "0")}` : "";
  const common = { "aria-invalid": invalid || undefined, "aria-describedby": describedBy, required };
  return (
    <div className="date-parts">
      <select id={id} aria-label="Day" value={day} onChange={(e) => setD(e.target.value)} {...common}>
        <option value="">Day</option>
        {Array.from({ length: days }, (_, i) => <option key={i} value={String(i + 1)}>{i + 1}</option>)}
      </select>
      <select aria-label="Month" value={m} onChange={(e) => setM(e.target.value)} {...common}>
        <option value="">Month</option>
        {months.map((name, i) => <option key={name} value={String(i + 1)}>{name}</option>)}
      </select>
      <select aria-label="Year" value={y} onChange={(e) => setY(e.target.value)} {...common}>
        <option value="">Year</option>
        {years.map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
