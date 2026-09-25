/**
 * RafikiHub site data, structured to match the old rafikihub.com.
 *
 * The shapes below mirror what the old site shows publicly:
 *  - Talent profiles  (old URL: /profile?url=<profileUrl>)  → TalentProfile
 *  - Member types     (old page: /join-now)                → MemberType
 *  - Articles         (old URL: /article?url=<url>)        → Article
 *  - Testimonials     (old home page)                      → Testimonial
 *  - Team             (old page: /team)                    → TeamMember
 *
 * Old profiles display "Not Available" for empty fields. Here that is `null`;
 * use `show()` to render it the same way.
 *
 * Real member profiles belong in the database (65,000+ members won't fit in a file).
 * The TalentProfile type is the contract for that table and for any profile pages.
 */

/* ────────────────────────────── Shared helpers ────────────────────────────── */

export type Maybe<T> = T | null;

export type Unit = "inches" | "cm";
export type Measurement = { value: number; unit: Unit };

/** Renders empty values the way the old site did. */
export function show(value: unknown, fallback = "Not available"): string {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object" && value && "value" in value && "unit" in value) {
    const m = value as Measurement;
    return `${m.value} ${m.unit}`;
  }
  return String(value);
}

export function formatHeight(h: Maybe<Height>) {
  return h ? `${h.feet} feet ${h.inches} inches` : "Not available";
}

export function formatPlayingAge(p: Maybe<PlayingAge>) {
  return p ? `${p.min} years - ${p.max} years` : "Not available";
}

export function ageFrom(dateOfBirth: Maybe<string>, today = new Date()) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

/* ─────────────────────────── Option lists (profile) ────────────────────────── */
// Values seen on existing profiles, plus common additions. Extend as needed.

export const profileCategories = [
  "Actor", "Young Performer", "Independent Performer", "Model", "Voice Over Artist",
  "Dancer", "Presenter", "Fashion Stylist", "Fashion Designer", "Make-up Artist", "Pet/Animal",
] as const;

export const appearanceOptions = [
  "Black-African", "Mixed Race", "East Asian", "South Asian", "Arab", "White", "Other",
] as const;

export const eyeColorOptions = ["Black", "Dark Brown", "Brown", "Hazel", "Green", "Blue", "Grey"] as const;

export const hairColorOptions = ["Black", "Dark Brown", "Brown", "Auburn", "Blonde", "Red", "Grey", "White", "Dyed"] as const;

export const hairLengthOptions = ["Shaved", "Bald", "Short", "Mid Length", "Long", "Very Long", "Locs", "Braids"] as const;

export const facialHairOptions = ["Clean Shaven", "Stubble", "Moustache", "Goatee", "Full Beard"] as const;

export const voiceQualityOptions = ["Husky", "Strong", "Warm", "Bright", "Deep", "Soft", "Gravelly", "Breathy"] as const;

export const voiceCharacterOptions = ["Sincere", "Authoritative", "Friendly", "Conversational", "Energetic", "Calm", "Playful"] as const;

export const appearanceTraitOptions = ["Tatoo", "Piercing", "Birthmark", "Scar"] as const;

/* ─────────────────────────────── Talent profile ────────────────────────────── */

export type Height = { feet: number; inches: number };
export type PlayingAge = { min: number; max: number };

export type TalentProfile = {
  /** The old `?url=` value, e.g. "katesnow". Keep it so old profile links keep working. */
  profileUrl: string;
  fullName: string;
  category: (typeof profileCategories)[number];

  /** CONTACT DETAILS (old section) */
  contactDetails: {
    country: string;
    website: Maybe<string>;
    phone: Maybe<string>;
    email: Maybe<string>;
    address: Maybe<string>;
  };

  /** PERSONAL DATA */
  personalData: {
    dateOfBirth: Maybe<string>; // ISO date, age is calculated
    playingAge: Maybe<PlayingAge>;
    country: string;
    height: Maybe<Height>;
  };

  /** CITIES and NATIONALITIES */
  cities: string[];
  nationalities: string[];

  /** MY APPEARANCE */
  appearance: {
    appearance: Maybe<(typeof appearanceOptions)[number]>;
    eyeColor: Maybe<(typeof eyeColorOptions)[number]>;
    hairColor: Maybe<(typeof hairColorOptions)[number]>;
    hairLength: Maybe<(typeof hairLengthOptions)[number]>;
    facialHair: Maybe<(typeof facialHairOptions)[number]>;
  };

  /** VOICE ATTRIBUTES */
  voiceAttributes: {
    voiceQuality: Maybe<(typeof voiceQualityOptions)[number]>;
    voiceCharacter: Maybe<(typeof voiceCharacterOptions)[number]>;
  };

  /** MY VOICE RANGE, e.g. "Alto F3 - D5" */
  voiceRange: {
    lowVoice: Maybe<string>;
    mediumVoice: Maybe<string>;
    highVoice: Maybe<string>;
  };

  /** FURTHER MEASUREMENTS */
  furtherMeasurements: {
    bustChest: Maybe<Measurement>;
    waist: Maybe<Measurement>;
    hips: Maybe<Measurement>;
    insideLeg: Maybe<Measurement>;
    insideArm: Maybe<Measurement>;
    collar: Maybe<Measurement>;
    hat: Maybe<Measurement>;
    weightKg: Maybe<number>;
    shoeSize: Maybe<string>; // UK and EU sizes both appear on old profiles
    dressSize: Maybe<string>;
  };

  /** APPEARANCE TRAITS: TRAIT + LOCATION rows */
  appearanceTraits: { trait: (typeof appearanceTraitOptions)[number]; location: string }[];

  /** Free-text "about me" */
  bio: Maybe<string>;

  /** Searchable profile content referenced in the old FAQ */
  skills: string[];
  languages: string[];
  accents: string[];
  credits: { year: number; production: string; role: string; type: "Film" | "TV" | "Theatre" | "Commercial" | "Radio" | "Voice Over" | "Music Video" | "Other"; director?: string }[];
  training: { institution: string; course: string; year?: number }[];

  /** Media sections: headshots, SHOWREEL, VOICEOVER REEL, TALENT DOCUMENTS */
  media: {
    headshots: string[];
    showreelUrl: Maybe<string>;
    voiceoverReelUrl: Maybe<string>;
    documents: { name: string; url: string }[];
  };

  /** Enhanced listing (old "take an enhanced listing" upgrade) */
  isEnhanced: boolean;
  representedByRafikiHub: boolean;
  createdAt: string;
};

/** Example profile showing every field filled in. Fictional; for development and tests only. */
export const exampleProfile: TalentProfile = {
  profileUrl: "example-performer",
  fullName: "Example Performer",
  category: "Actor",
  contactDetails: { country: "Kenya", website: null, phone: null, email: null, address: "Nairobi" },
  personalData: {
    dateOfBirth: "1995-06-15",
    playingAge: { min: 25, max: 32 },
    country: "Kenya",
    height: { feet: 5, inches: 8 },
  },
  cities: ["Nairobi, Kenya", "Mombasa, Kenya"],
  nationalities: ["Kenyan"],
  appearance: { appearance: "Black-African", eyeColor: "Dark Brown", hairColor: "Black", hairLength: "Short", facialHair: null },
  voiceAttributes: { voiceQuality: "Warm", voiceCharacter: "Friendly" },
  voiceRange: { lowVoice: null, mediumVoice: "Mezzo C4 - A5", highVoice: null },
  furtherMeasurements: {
    bustChest: { value: 34, unit: "inches" },
    waist: { value: 28, unit: "inches" },
    hips: { value: 38, unit: "inches" },
    insideLeg: { value: 31, unit: "inches" },
    insideArm: null,
    collar: null,
    hat: null,
    weightKg: 60,
    shoeSize: "6",
    dressSize: "10",
  },
  appearanceTraits: [{ trait: "Piercing", location: "Both ears" }],
  bio: "Screen and stage actor based in Nairobi. Fluent in English and Swahili.",
  skills: ["Stage combat", "Contemporary dance", "Swimming"],
  languages: ["English", "Swahili"],
  accents: ["Kenyan", "Standard British"],
  credits: [{ year: 2025, production: "Example Feature", role: "Supporting", type: "Film" }],
  training: [{ institution: "RafikiHub Acting Workshop", course: "Screen acting intensive", year: 2024 }],
  media: { headshots: [], showreelUrl: null, voiceoverReelUrl: null, documents: [] },
  isEnhanced: false,
  representedByRafikiHub: false,
  createdAt: "2026-01-01",
};

/* ──────────────────────────── Member types (join) ──────────────────────────── */

export type MemberType = {
  key: "talent" | "young-performer" | "agent" | "casting-professional" | "industry-client" | "pet-animal" | "studio-space" | "creative";
  name: string;
  /** Short line used in lists */
  tagline: string;
  /** Benefits from the old join page */
  benefits: string[];
  /** Options shown in the join form's "I'm joining as" field */
  formLabel: string;
};

export const memberTypes: MemberType[] = [
  {
    key: "talent",
    name: "Actors and performers",
    tagline: "Film, TV, theatre, radio, commercials and live performance.",
    formLabel: "Actor or performer",
    benefits: [
      "Showcase your professional portfolio to the industry professionals who use RafikiHub every day",
      "Submit your RafikiHub link for upcoming work instantly",
      "Support with events, career advice and training workshops",
    ],
  },
  {
    key: "young-performer",
    name: "Young performers",
    tagline: "Aspiring performers aged 4 to 18, registered by a parent or guardian.",
    formLabel: "Young performer (4 to 18)",
    benefits: [
      "Find the best roles available for young people",
      "A full professional profile, headshots and multimedia included",
      "A profile seen by the industry professionals who use RafikiHub daily",
    ],
  },
  {
    key: "agent",
    name: "Agents",
    tagline: "Submit your clients directly to live castings.",
    formLabel: "Agent",
    benefits: [
      "Give your clients access to roles in television, film, theatre and commercials",
      "Submit clients for roles and share their profiles, experience, skills and showreels",
    ],
  },
  {
    key: "casting-professional",
    name: "Casting directors",
    tagline: "Search the talent database and run castings.",
    formLabel: "Casting director",
    benefits: [
      "Search or browse our database of performers",
      "Send out casting briefs and receive submissions",
      "Manage audition lists, and capture and share audition footage",
    ],
  },
  {
    key: "industry-client",
    name: "Brands and event organisers",
    tagline: "Find brand ambassadors and performers for corporate events.",
    formLabel: "Brand or event organiser",
    benefits: [
      "Browse the talent database and contact talent directly",
      "Post a casting call to find a brand ambassador or performer for a corporate event",
    ],
  },
  {
    key: "pet-animal",
    name: "Pet models",
    tagline: "Well-trained animals for shoots, ads and screen work.",
    formLabel: "Pet model",
    benefits: [
      "Present your pet or animal to the industry with its own profile",
      "Submit your pet for castings and auditions",
      "Upload videos of your pet's best tricks and training for casting teams to see",
    ],
  },
  {
    key: "studio-space",
    name: "Studio spaces",
    tagline: "Studios, rehearsal rooms and locations to hire.",
    formLabel: "Studio or space",
    benefits: [
      "List and advertise your studio, space or rehearsal room",
      "Connect with productions that need a space like yours",
    ],
  },
  {
    key: "creative",
    name: "Stylists, designers and make-up artists",
    tagline: "Creative crew for shoots and productions.",
    formLabel: "Stylist, designer or make-up artist",
    benefits: [
      "Show your portfolio to productions and brands",
      "Get booked for shoots, sets and campaigns",
    ],
  },
];

/* ───────────────────────────────── Articles ───────────────────────────────── */

export type Article = {
  /** The old `?url=` value. Old link /article?url=<url> redirects to /blog/<url>. */
  url: string;
  title: string;
  excerpt: string;
  publishedAt: string; // ISO
  author: string;
  image: Maybe<string>;
  content: { heading?: string; text: string }[];
};

export const articles: Article[] = [
  {
    // Same slug as the old article so the old link redirects here
    url: "lucy-maina---rafikihub-member--talent",
    title: "Lucy Maina: RafikiHub member and represented talent",
    excerpt: "Actress Lucy Maina on mentorship, headshots and workshops with RafikiHub Talent Management.",
    publishedAt: "2024-03-26",
    author: "RafikiHub",
    image: "/images/people/lucy-maina.jpg",
    content: [
      { text: "Talent management platforms like RafikiHub, founded by Kate Snow, are changing how Kenyan actors build careers in film and TV. Members get acting mentorship, help preparing headshots and reels, and networking events with working professionals." },
      { text: "Actress Lucy Maina is both a member and represented by RafikiHub Talent Management. She has taken part in several RafikiHub workshops and headshot sessions, and her most recent headshots were shot with Kate." },
    ],
  },
  {
    url: "how-to-get-a-great-acting-headshot",
    title: "How to get an acting headshot that gets you called in",
    excerpt: "What casting directors look for in a headshot, and how to choose the right photographer in Kenya.",
    publishedAt: "2026-09-01",
    author: "RafikiHub",
    image: null,
    content: [
      { text: "Your headshot is the first thing a casting director sees when you apply for a role. On RafikiHub, profiles are viewed in a grid, so yours has a second or two to make someone click." },
      { heading: "What a good headshot looks like", text: "It is recent, natural and shows you as you look today. It is a head-and-shoulders shot with simple clothing and a plain background. No props, hats or heavy accessories. Your eyes are your most important feature, so they should be sharp and clearly visible." },
      { heading: "What to avoid", text: "Blurry, pixelated or obviously amateur photos make you look unprofessional. So do heavy filters and styling that doesn't look like you. A casting director wants to see the real you walk through the door." },
      { heading: "Choosing a photographer", text: "Pick someone who photographs performers, not mainly musicians or events. Ask to see their previous headshots, and ask other actors whose photos you like who they used. Before you book, get a clear breakdown of the price, the number of looks and the number of edited images." },
    ],
  },
  {
    url: "how-casting-works-on-rafikihub",
    title: "How casting works on RafikiHub, step by step",
    excerpt: "From breakdown to audition: what happens after a casting director posts a role, and how to submit well.",
    publishedAt: "2026-08-15",
    author: "RafikiHub",
    image: null,
    content: [
      { text: "Casting directors across Africa use RafikiHub to send out breakdowns for the roles they're casting. Here's what happens next, and how to give yourself the best chance." },
      { heading: "1. The breakdown goes out", text: "Breakdowns go straight to registered agents and to talent who match. Some leave out the casting director's name. That's normal: it stops them being flooded with messages, or protects project details that aren't public yet." },
      { heading: "2. You or your agent submit", text: "Submit through RafikiHub unless the breakdown says otherwise. Don't send printed CVs, call or email the casting director directly. Your profile, with headshots, credits, showreel and skills, is what they'll look at." },
      { heading: "3. The shortlist is invited to audition", text: "The casting director reviews submissions and invites a shortlist. If you don't hear back, you weren't picked this time. Keep your profile fresh and keep applying." },
      { heading: "Keep castings confidential", text: "Casting information on RafikiHub is private. Sharing it outside the platform breaks the production's copyright and our terms, and leads to membership being terminated." },
    ],
  },
];

/* ─────────────────────────────── Testimonials ─────────────────────────────── */

export type Testimonial = {
  name: string;
  /** Shown as "- Actress -" on the old site */
  category: string;
  /** Full message. The old site cut these off with "Read More". */
  message: string;
  image: Maybe<string>;
};

export const testimonials: Testimonial[] = [
  { name: "June Wekesa", category: "Actress", image: "/images/people/june-wekesa.jpg", message: "It has been a great pleasure working with you, and we greatly appreciate the chance you gave us to be a part of your team." },
  { name: "Sam Wachira", category: "Independent Performer", image: "/images/people/sam-wachira.jpg", message: "If you are a performer in the arts looking for a place to market yourself, I've got one word for you: RafikiHub! It's the first of its kind here." },
  { name: "Brenda Ngeso", category: "Actress", image: "/images/people/brenda-ngeso.jpg", message: "This is a very helpful platform and more professional in terms of artistic growth and management. It helps in sourcing out actors and performers." },
  { name: "Amani Mwasera", category: "Independent Performer", image: "/images/people/amani-mwasera.jpg", message: "Awesome website." },
  { name: "Bob Zenga", category: "Actor", image: "/images/people/bob-zenga.jpg", message: "RafikiHub is one of the best platforms an artist needs to be on. Getting an opportunity here as a puppeteer is always an experience." },
  { name: "Olivia Makena Makau", category: "Actress", image: "/images/people/olivia-makena-makau.jpg", message: "To describe RafikiHub in three words: friendly, nurturing, peak professionalism. That's four words." },
  { name: "Tasiana Kalimbo", category: "Actress", image: "/images/people/tasiana-kalimbo.jpg", message: "RafikiHub has been nurturing people with skills all over the world. You are free to join." },
  { name: "Mirell Nazi", category: "Independent Performer", image: "/images/people/mirell-nazi.jpg", message: "I found RafikiHub at a time in my life when I was going through a journey of self-discovery. Their workshops have definitely been an important part of it." },
  { name: "Derrick Kinyanjui", category: "Actor", image: "/images/people/derrick-kinyanjui.jpg", message: "The profile setup that lets you package yourself fully as an artist really stands out to me." },
  { name: "Seda Nigel", category: "Actor", image: "/images/people/seda-nigel.jpg", message: "Rafiki… Rafiki… Rafiki. This is the place to be. I came across RafikiHub way back and it didn't take long for me to be noticed." },
  { name: "Lucy Maina", category: "Actress", image: "/images/people/lucy-maina.jpg", message: "RafikiHub offers plenty of opportunities for creatives to hone their skills. Working with Kate Snow has honestly been a game changer." },
];

/* ─────────────────────────────────── Team ─────────────────────────────────── */

export type TeamMember = {
  name: string;
  position: string;
  image: Maybe<string>;
  bio: string[];
  /** Links the team member to their own talent profile, if they have one */
  profileUrl?: string;
};

export const team: TeamMember[] = [
  {
    name: "Kate Snow",
    position: "Founder and CEO",
    image: "/images/people/kate-snow.jpg",
    profileUrl: "katesnow",
    bio: [
      "Kate studied at Lewisham College from 2009, earning a BTEC National Diploma in Performing Arts, then trained at Arts Educational Schools in Chiswick, London, graduating with a BA (Hons) in Acting for Film and Television.",
      "She worked as an actress in London for several years, represented by John Doe Management, before returning home to Kenya in 2017 to continue her acting career, with roles including the film You Again and the short film Relationship Goals.",
      "Kate founded RafikiHub to empower, educate and nurture Kenyan and African artists on their way to professional careers. Through training, mentoring, casting and talent management, RafikiHub has worked with production companies from the UK, US and South Africa.",
    ],
  },
  // The old /team page has a second profile (the CEO's business partner). Add it here:
  // { name: "", position: "", image: "/images/people/<name>.jpg", bio: [""] },
];

/* ───────────────────────────── How casting works ──────────────────────────── */

export const castingSteps = [
  { title: "A casting director posts a breakdown", text: "Role descriptions, dates and requirements go out through RafikiHub." },
  { title: "Agents and talent receive it", text: "Registered agents and matching performers get the breakdown directly." },
  { title: "Submissions arrive in one place", text: "Agents submit clients and performers submit their own profiles." },
  { title: "The shortlist is invited to audition", text: "The casting director reviews profiles and invites the right people in." },
];

/* ─────────────────────────────────── FAQs ─────────────────────────────────── */

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  { q: "What is RafikiHub?", a: "RafikiHub is a casting platform based in Nairobi, Kenya. It connects actors, models, performers and other creatives across Kenya, East Africa and Africa with casting directors, agents and producers working in film, television, theatre and commercials." },
  { q: "How does casting work on RafikiHub?", a: "Casting directors post breakdowns for the roles they are casting. The breakdowns go to registered agents and talent. Agents submit their clients and performers submit themselves. The casting director reviews the submissions and invites a shortlist to audition." },
  { q: "Who can join RafikiHub?", a: "Actors and performers, young performers aged 4 to 18, agents, casting directors, brands and event organisers, owners of trained pets and animals, studio spaces, and stylists, designers and make-up artists." },
  { q: "What goes on a RafikiHub profile?", a: "Headshots, credits, showreels, voice-over reels, skills, playing age, height, appearance, voice attributes and measurements. Casting directors can search all of these, so the more complete your profile, the easier you are to find." },
  { q: "Why do casting directors use RafikiHub?", a: "It is the quickest way to get casting and audition information straight to agents and talent. Every performer has a searchable profile with headshots, credits, showreels, voice clips and skills, so casting directors can find and shortlist people in one place." },
  { q: "How do I start a career in acting in Kenya?", a: "Train and build experience first. Many actors begin in small, low-budget stage or film productions, then move to bigger jobs as their credits grow. Acting workshops sharpen your technique and connect you with people who can help your career." },
  { q: "What makes a good acting headshot?", a: "A recent, natural head-and-shoulders photo that looks like you do today. Keep clothing simple, avoid props, hats and busy backgrounds, and make sure your eyes are clearly visible. Casting directors see headshots in a grid, so it must be sharp and professional, never blurry or pixelated." },
  { q: "How do I choose a headshot photographer?", a: "Choose a photographer who shoots performers, not one who mainly photographs musicians or events. Ask to see previous headshots, ask other performers who they used, and get a full price and package breakdown before you book." },
  { q: "How should I apply for a role?", a: "Unless the breakdown says otherwise, submit yourself through RafikiHub. Casting directors don't want printed CVs, phone calls or direct emails. Everything they need is on your profile and in the message you include with your submission." },
  { q: "Why doesn't a casting breakdown show the casting director's details?", a: "This is normal. Many casting professionals leave their details out to avoid being flooded with messages, or because parts of the project aren't public yet. If you suit the role, submit as usual and you'll receive more information if you're invited to audition." },
  { q: "Will I hear back if I'm not successful?", a: "Not always. Casting directors will contact you if they want you to audition. If you don't hear back, you weren't selected on that occasion. Some let unsuccessful applicants know, depending on their workload and the number of submissions." },
  { q: "Can I share casting information with friends?", a: "No. Casting information on RafikiHub is private and confidential. Sharing it outside the platform breaches the production's copyright and RafikiHub's terms, and any member found circulating casting information will have their membership terminated." },
  { q: "Can my pet be cast in a commercial or film?", a: "Yes. Productions sometimes need animals with a specific breed, look or temperament for shoots, commercials, TV and film. If your pet is well trained, you can register it as a pet model and submit it for castings." },
  { q: "How do I contact RafikiHub?", a: "Email info@rafikihub.com or call +254 114 011 932. For agent representation, email talent@rafikihub.com." },
];
