/** Shared, client-safe bits for the Performer and Casting dashboards. */

export type DashboardRole = "performer" | "casting";

export const dashboardRoles: { role: DashboardRole; label: string; href: string }[] = [
  { role: "performer", label: "Performer dashboard", href: "/dashboard/performer" },
  { role: "casting", label: "Casting dashboard", href: "/dashboard/casting" },
];

/** Which dashboard a join-form "I'm joining as" choice opens. Agents, casting directors and brands cast; everyone else performs. */
export function roleForCategory(category: string): DashboardRole {
  return /agent|casting|brand|organiser/i.test(category) ? "casting" : "performer";
}

// Sample content until the dashboards are connected to real castings and submissions.
// Names are fictional and every block using these is labelled "Sample" on the page.
export const sampleCastings = [
  { title: "Lead role in a Nairobi-set feature film", type: "Feature film", location: "Nairobi", roles: "Female, playing age 25 to 35, fluent in Swahili and English" },
  { title: "TV commercial for a mobile money brand", type: "Commercial", location: "Nairobi", roles: "Families of all ages, natural and warm on camera" },
  { title: "Stage musical ensemble", type: "Theatre", location: "Nairobi", roles: "Singers and dancers, playing age 18 to 30" },
];

export const sampleSubmissions = [
  { name: "Amina Wanjiru", category: "Actress", age: "24 to 30", via: "Agent", status: "Shortlisted" },
  { name: "Brian Otieno", category: "Actor", age: "28 to 35", via: "Self-submitted", status: "New" },
  { name: "Faith Njeri", category: "Actress", age: "18 to 24", via: "Self-submitted", status: "New" },
  { name: "Kevin Mutua", category: "Actor", age: "30 to 40", via: "Agent", status: "Audition booked" },
];
