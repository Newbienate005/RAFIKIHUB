/**
 * Shared, client-safe bits for the Performer and Casting dashboards.
 * The sections mirror the old rafikihub.com dashboard (dashboard/index.php and its tabs).
 */

export type DashboardRole = "performer" | "casting";

export const dashboardRoles: { role: DashboardRole; label: string; href: string }[] = [
  { role: "performer", label: "Performer dashboard", href: "/dashboard/performer" },
  { role: "casting", label: "Casting dashboard", href: "/dashboard/casting" },
];

/** Which dashboard a join-form "I'm joining as" choice opens. Agents, casting directors and brands cast; everyone else performs. */
export function roleForCategory(category: string): DashboardRole {
  return /agent|casting|brand|organiser/i.test(category) ? "casting" : "performer";
}
export const isAgent = (category?: string) => /agent/i.test(category ?? "");

export const performerTabs = [
  { id: "home", label: "Home" },
  { id: "opportunities", label: "Opportunities" },
  { id: "media", label: "My media" },
  { id: "cv", label: "Edit CV" },
  { id: "agents", label: "My agents" },
] as const;

export const castingTabs = [
  { id: "home", label: "Overview" },
  { id: "castings", label: "My castings" },
  { id: "talent", label: "Find talent" },
  { id: "roster", label: "My talents", agentsOnly: true },
] as const;

/** Old site rule: photos, date of birth, skills and credits each count for 25% of a complete profile. */
export const completenessItems = [
  { key: "photos", label: "Photos", href: "/services#headshots" },
  { key: "dob", label: "Date of birth" },
  { key: "skills", label: "Skills" },
  { key: "credits", label: "Credits" },
] as const;

/** Casting status as the old site worked it out: filled if marked filled, otherwise open until the closing date. */
export function castingStatus(c: { filled?: boolean; closes: string }, today = new Date()) {
  if (c.filled) return "Filled";
  return new Date(c.closes) >= today ? "Open" : "Closed";
}

// ───────── The old CV editor's field groups (performers-body.php), shown on the Edit CV tab
export const cvSections = [
  { title: "Personal", fields: ["Full name", "Website", "Country and phone", "Profile link", "Date of birth", "Gender", "About me", "Playing age", "Cities (up to 3)", "Nationalities (up to 5)"] },
  { title: "Appearance", fields: ["Height (feet and inches, or cm)", "Appearance", "Eye colour", "Hair colour", "Hair length", "Facial hair", "Tattoos, piercings and scars", "Twin"] },
  { title: "Voice", fields: ["Voice quality", "Voice character", "Vocal range (low, medium, high)", "Music genres"] },
  { title: "Measurements", fields: ["Chest", "Waist", "Hips", "Inside leg", "Inside arm", "Collar", "Hat", "Weight", "Shoe size", "Dress size"] },
  { title: "Skills", fields: ["Accents and dialects", "Languages", "Music and dance", "Performance", "Presenting", "Sports", "Vehicle licences", "Other skills"] },
  { title: "Credits and training", fields: ["Production title, type, year, role, company and director", "Courses, institutions and years"] },
  { title: "Social links", fields: ["Facebook", "X (Twitter)", "Instagram", "LinkedIn", "YouTube", "WhatsApp", "Telegram"] },
];

/** Production types from the old credits form */
export const creditTypes = [
  "Animation", "Commercial", "Corporate", "Dance", "Documentary", "Educational", "Event", "Feature Film", "Film School",
  "Modelling", "Music Video", "Musical", "Radio", "Short Film", "Stage", "Still Photography", "Television",
  "Television Movie", "Video Game", "Voice Over", "Web Series", "Workshop", "Other",
];

// ───────── Sample content until the dashboards are connected to real data.
// Names are fictional and every block using these is labelled "Sample" on the page.
export const sampleCastings = [
  { id: "RH1021", title: "Lead role in a Nairobi-set feature film", type: "Feature film", location: "Nairobi", gender: "Female", closes: "2026-12-15", roles: "Playing age 25 to 35, fluent in Swahili and English" },
  { id: "RH1017", title: "TV commercial for a mobile money brand", type: "Commercial", location: "Nairobi", gender: "Everybody", closes: "2026-11-30", roles: "Families of all ages, natural and warm on camera" },
  { id: "RH1009", title: "Stage musical ensemble", type: "Theatre", location: "Nairobi", gender: "Everybody", closes: "2026-09-01", roles: "Singers and dancers, playing age 18 to 30" },
  { id: "RH0998", title: "Short film, supporting role", type: "Short film", location: "Mombasa", gender: "Male", closes: "2026-08-20", roles: "Playing age 40 to 55", filled: true },
];

export const sampleSubmissions = [
  { name: "Amina Wanjiru", category: "Actress", age: "24 to 30", via: "Agent", status: "Shortlisted", casting: "RH1021" },
  { name: "Brian Otieno", category: "Actor", age: "28 to 35", via: "Self-submitted", status: "New", casting: "RH1017" },
  { name: "Faith Njeri", category: "Actress", age: "18 to 24", via: "Self-submitted", status: "New", casting: "RH1021" },
  { name: "Kevin Mutua", category: "Actor", age: "30 to 40", via: "Agent", status: "Audition booked", casting: "RH1017" },
];

export const sampleAgents = [
  { name: "Savannah Talent Agency", city: "Nairobi", status: "Approved" },
  { name: "Coastline Artists", city: "Mombasa", status: "Pending" },
];

export const sampleRoster = [
  { name: "Grace Achieng", category: "Actress", status: "Approved" },
  { name: "Samuel Kiprop", category: "Actor", status: "Approved" },
  { name: "Joy Wairimu", category: "Young performer", status: "Pending" },
];

export const sampleTalent = [
  { name: "Amina Wanjiru", category: "Actress", gender: "Female", city: "Nairobi", age: "24 to 30", languages: ["English", "Swahili"] },
  { name: "Brian Otieno", category: "Actor", gender: "Male", city: "Kisumu", age: "28 to 35", languages: ["English", "Swahili", "Dholuo"] },
  { name: "Faith Njeri", category: "Actress", gender: "Female", city: "Nairobi", age: "18 to 24", languages: ["English", "Swahili", "Kikuyu"] },
  { name: "Kevin Mutua", category: "Actor", gender: "Male", city: "Machakos", age: "30 to 40", languages: ["English", "Swahili", "Kamba"] },
  { name: "Zawadi Hassan", category: "Dancer", gender: "Female", city: "Mombasa", age: "20 to 28", languages: ["English", "Swahili"] },
  { name: "Leo Kamau", category: "Young performer", gender: "Male", city: "Nairobi", age: "10 to 13", languages: ["English", "Swahili"] },
  { name: "Mercy Chebet", category: "Model", gender: "Female", city: "Eldoret", age: "20 to 26", languages: ["English", "Swahili", "Kalenjin"] },
  { name: "David Ouma", category: "Crew", gender: "Male", city: "Nairobi", age: "30 to 45", languages: ["English", "Swahili"] },
];
