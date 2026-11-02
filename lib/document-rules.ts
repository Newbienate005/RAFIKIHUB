/** Which private documents a member needs, and what an upload may be (no imports, so it can be unit tested). */

export const documentKinds = {
  young: [
    { id: "birth-certificate", label: "Birth certificate" },
    { id: "guardian-id", label: "Parent or guardian ID" },
    { id: "consent", label: "Signed parent or guardian consent" },
  ],
  pet: [
    { id: "pet-ownership", label: "Proof of ownership" },
    { id: "pet-vaccination", label: "Vaccination record" },
  ],
} as const;

export type DocumentGroup = keyof typeof documentKinds;
export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024; // under Vercel's 4.5 MB request limit

/** Pets and anyone under 18 (or registered as a young performer) send documents; everyone else doesn't. */
export function documentGroup(m: { category?: string | null; dateOfBirth?: string | null }, today = new Date()): DocumentGroup | null {
  const c = (m.category ?? "").toLowerCase();
  if (c === "pet") return "pet";
  if (c.includes("young")) return "young";
  if (m.dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(m.dateOfBirth)) {
    const d = new Date(`${m.dateOfBirth}T00:00:00`);
    if (new Date(d.getFullYear() + 18, d.getMonth(), d.getDate()) > today) return "young";
  }
  return null;
}

/** The real type of an upload from its first bytes (the name and the browser's claim can be faked), or null. */
export function sniffDocument(b: Uint8Array): "application/pdf" | "image/jpeg" | "image/png" | "image/webp" | null {
  const at = (i: number, ...v: number[]) => v.every((x, k) => b[i + k] === x);
  if (at(0, 0x25, 0x50, 0x44, 0x46, 0x2d)) return "application/pdf"; // %PDF-
  if (at(0, 0xff, 0xd8, 0xff)) return "image/jpeg";
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50)) return "image/webp"; // RIFF....WEBP
  return null;
}
