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
  "Dancer", "Presenter", "Fashion Stylist", "Fashion Designer", "Make-up Artist",
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
  key: "talent" | "young-performer" | "agent" | "casting-professional" | "industry-client" | "crew";
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
    key: "crew",
    name: "Crew",
    tagline: "Camera, lighting, sound, styling, make-up and more.",
    formLabel: "Crew (camera, lighting, styling, make-up…)",
    benefits: [
      "Express yourself and boost your portfolio",
      "Build industry contacts with productions and brands",
      "Get booked for shoots, sets and campaigns",
    ],
  },
];

/* ───────────────────────────────── Articles ───────────────────────────────── */

/** The old blog had an "All Genres" filter. These are the genres used here. */
export const articleGenres = ["Article", "Review", "Member story", "Advice"] as const;
export type ArticleGenre = (typeof articleGenres)[number];

export type Article = {
  /** The old `?url=` value. Old link /article?url=<url> redirects to /blog/<url>. */
  url: string;
  title: string;
  genre: ArticleGenre;
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
    genre: "Member story",
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
    genre: "Advice",
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
    genre: "Advice",
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

  /* Articles from the old blog. Summaries only: paste the full text from the old site into `content`. */
  {
    url: "lwanda-otero-the-musical-review", // TODO: match the old article's ?url= value so its link redirects here
    title: "Lwanda Otero: The Musical, reviewed",
    genre: "Review",
    excerpt: "A modern musical retelling of a Kenyan folk tale, strong on music and dance but light on depth.",
    publishedAt: "2024-09-09",
    author: "RafikiHub",
    image: "/images/legacy/lwanda-otero.jpg",
    content: [
      { text: "Our review of Lwanda Otero: The Musical, a new stage retelling of the Kenyan legend of Lwanda, performed in Nairobi by a cast of actors, dancers, singers and musicians." },
      { text: "The production opens strongly with live music and choreography, and shows Nairobi's growing appetite for theatre. Our reviewer found the humour and energy enjoyable, but felt the lighter tone came at the cost of the story's depth." },
    ],
  },
  {
    url: "a-homage-to-the-film-actor",
    title: "A homage to the film actor",
    genre: "Article",
    excerpt: "To be an artist or not to be: on choosing the actor's life, and how RafikiHub supports those who do.",
    publishedAt: "2024-02-19",
    author: "RafikiHub",
    image: "/images/legacy/homage-to-the-film-actor.jpg",
    content: [
      { text: "Starting from Hamlet's famous question, this piece reframes it for performers: to be an artist or not to be one. It reflects on the courage it takes to choose acting over more traditional careers." },
      { text: "It closes on RafikiHub's role: linking performers with credible theatre, TV and film productions, and restoring professionalism to the craft through training, mentorship and portfolios built to international standards." },
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

export type FaqCategory = "About RafikiHub" | "Membership" | "Castings and auditions" | "Profiles and headshots";
export const faqCategories: FaqCategory[] = ["About RafikiHub", "Membership", "Castings and auditions", "Profiles and headshots"];
export type Faq = { q: string; a: string; category: FaqCategory };

export const faqs: Faq[] = [
  { category: "About RafikiHub", q: "What is RafikiHub?", a: "RafikiHub is a casting platform based in Nairobi, Kenya. It connects actors, models, performers and other creatives across Kenya, East Africa and Africa with casting directors, agents and producers working in film, television, theatre and commercials." },
  { category: "Castings and auditions", q: "How does casting work on RafikiHub?", a: "Casting directors post breakdowns for the roles they are casting. The breakdowns go to registered agents and talent. Agents submit their clients and performers submit themselves. The casting director reviews the submissions and invites a shortlist to audition." },
  { category: "Membership", q: "Who can join RafikiHub?", a: "Actors and performers, young performers aged 4 to 18, agents, casting directors, brands and event organisers, and stylists, designers and make-up artists." },
  { category: "Profiles and headshots", q: "What goes on a RafikiHub profile?", a: "Headshots, credits, showreels, voice-over reels, skills, playing age, height, appearance, voice attributes and measurements. Casting directors can search all of these, so the more complete your profile, the easier you are to find." },
  { category: "About RafikiHub", q: "Why do casting directors use RafikiHub?", a: "It is the quickest way to get casting and audition information straight to agents and talent. Every performer has a searchable profile with headshots, credits, showreels, voice clips and skills, so casting directors can find and shortlist people in one place." },
  { category: "Profiles and headshots", q: "How do I start a career in acting in Kenya?", a: "Train and build experience first. Many actors begin in small, low-budget stage or film productions, then move to bigger jobs as their credits grow. Acting workshops sharpen your technique and connect you with people who can help your career." },
  { category: "Profiles and headshots", q: "What makes a good acting headshot?", a: "A recent, natural head-and-shoulders photo that looks like you do today. Keep clothing simple, avoid props, hats and busy backgrounds, and make sure your eyes are clearly visible. Casting directors see headshots in a grid, so it must be sharp and professional, never blurry or pixelated." },
  { category: "Profiles and headshots", q: "How do I choose a headshot photographer?", a: "Choose a photographer who shoots performers, not one who mainly photographs musicians or events. Ask to see previous headshots, ask other performers who they used, and get a full price and package breakdown before you book." },
  { category: "Castings and auditions", q: "How should I apply for a role?", a: "Unless the breakdown says otherwise, submit yourself through RafikiHub. Casting directors don't want printed CVs, phone calls or direct emails. Everything they need is on your profile and in the message you include with your submission." },
  { category: "Castings and auditions", q: "Why doesn't a casting breakdown show the casting director's details?", a: "This is normal. Many casting professionals leave their details out to avoid being flooded with messages, or because parts of the project aren't public yet. If you suit the role, submit as usual and you'll receive more information if you're invited to audition." },
  { category: "Castings and auditions", q: "Will I hear back if I'm not successful?", a: "Not always. Casting directors will contact you if they want you to audition. If you don't hear back, you weren't selected on that occasion. Some let unsuccessful applicants know, depending on their workload and the number of submissions." },
  { category: "Castings and auditions", q: "Can I share casting information with friends?", a: "No. Casting information on RafikiHub is private and confidential. Sharing it outside the platform breaches the production's copyright and RafikiHub's terms, and any member found circulating casting information will have their membership terminated." },
  { category: "Membership", q: "How much does RafikiHub membership cost?", a: "Basic membership is Ksh 250 per month. Standard is Ksh 1,250 for 6 months and Premium is Ksh 2,500 for 12 months, which both work out at about Ksh 208 a month. Every plan includes a full profile and casting submissions." },
  { category: "About RafikiHub", q: "How do I contact RafikiHub?", a: "Email info@rafikihub.com or call +254 (0) 114 011 932. Our office is at Park Place Business Centre, Park Place Building, 2nd Floor, Parklands, Nairobi. For agent representation, email talent@rafikihub.com." },
];


/* ─────────────────────────── Home: three ways in ──────────────────────────── */
// Copy from the old rafikihub.com home page ("Our Services").
export const homePaths = [
  { title: "Performers", text: "Be seen by the industry and apply for professional work.", href: "/join" },
  { title: "Casting Professionals", text: "Access a vast database of performers and use us to cast your projects with fluidity and ease.", href: "/casting" },
  { title: "Crew", text: "Express yourself, boost your portfolio and build industry contacts.", href: "/join" },
];

/* ──────────────────────────────── Timeline ────────────────────────────────── */
// "RafikiHub — Our Journey". Supplied in the Figma design. CHECK: the design said Kate
// "returned to Kenya in 2021", but her bio says 2017; this version follows the bio.
export type TimelineItem = { year: string; title: string; tagline: string; body: string[] };

export const timeline: TimelineItem[] = [
  { year: "2021", title: "RafikiHub launch", tagline: "RafikiHub is born in Kenya.", body: ["Kate Snow launches RafikiHub with a vision of creating opportunities and spaces for people to connect through the arts."] },
  { year: "2021", title: "Building the creative community", tagline: "Growing the network.", body: ["RafikiHub begins connecting with actors, filmmakers, creatives and organisations, creating a growing community around the arts.", "Workshops launch with Charles J. Ouda on acting, Teddy Mungai on script supervising and Emmanuel Mugo on stunt coordination, alongside sessions led by Jazz Moll, Akinyi Oluoch and Martin Kigondu."] },
  { year: "2022", title: "Major partnerships", tagline: "RafikiHub goes global.", body: ["RafikiHub partners with South African animation studio Triggerfish, UK production house Blink and US studio Disney on its first international project."] },
  { year: "2023", title: "Deepening industry connections", tagline: "From projects to programmes.", body: ["RafikiHub strengthens relationships with artists, industry professionals, organisations and creative institutions, including the AFFC / Storytellers Film Lab."] },
  { year: "2024", title: "Expanding our work", tagline: "Building bridges across the industry.", body: ["RafikiHub develops more structured opportunities for creatives to learn, collaborate and grow their careers, and brings more creatives into its community."] },
  { year: "2025", title: "Investing in the next generation", tagline: "RafikiHub Kids is born.", body: ["A new branch of RafikiHub uses therapeutic drama and creative expression to support children's confidence, emotional development, creativity and connection."] },
  { year: "2026", title: "Building the RafikiHub ecosystem", tagline: "Talent, training, opportunities, storytelling and community in one place.", body: ["Talent profiles, headshot days, industry opportunities, masterclasses, film labs, creative projects and RafikiHub Kids all come together."] },
];

export const timelineClosing =
  "The story isn't finished. From one idea in 2017, to the platform's launch in 2021, to a growing community of creatives, storytellers and young people, RafikiHub keeps evolving, and this is only the beginning.";

/* ──────────────────────── Partners ("Who we've worked with") ─────────────────── */
// Taken from the timeline. CHECK before launch: confirm you can name each partner publicly.
// Add `logo: "/images/partners/<file>.svg"` to show a logo instead of the name.
export type Partner = { name: string; description?: string; url?: string; logo?: string };
export const partners: Partner[] = [
  { name: "Triggerfish", description: "Animation studio, South Africa" },
  { name: "Blink", description: "Production house, UK" },
  { name: "Disney", description: "Studio, US" },
  { name: "AFFC / Storytellers Film Lab" },
];

/* ─────────────────────────── Sio Bahati Services ───────────────────────────── */
// The three services listed under "Sio Bahati Services" in the old site's footer.
// CHECK: the summaries and "includes" lists are written as a starting point. Edit them to match what each package really includes.
// "Sio bahati" is Swahili for "it's not luck".
export type Service = { id: string; name: string; summary: string; includes: string[]; image: Maybe<string> };
export const services: Service[] = [
  {
    id: "headshots",
    name: "Headshots",
    summary: "Professional acting headshots shot for casting: natural, current and sharp enough to stand out in a casting director's grid.",
    includes: ["A session with a photographer who shoots performers", "Guidance on wardrobe and looks before the shoot", "Edited images ready for your RafikiHub profile"],
    image: "/images/legacy/service-headshots.jpg",
  },
  {
    id: "showreels",
    name: "Showreels",
    summary: "A short, well-cut reel of your best screen work, or newly shot scenes if you don't have footage yet, so casting teams can see you act.",
    includes: ["Help choosing and ordering your strongest clips", "Scene shooting for performers without footage", "A finished reel formatted for your profile"],
    image: "/images/legacy/service-showreels.jpg",
  },
  {
    id: "audition-preps",
    name: "Audition Preps",
    summary: "One-to-one preparation for a specific audition or self-tape, from reading the breakdown to working the scene.",
    includes: ["Script and character work for the role", "Self-tape set-up and delivery tips", "Practice runs with feedback"],
    image: "/images/legacy/service-audition-prep.jpg",
  },
];

/* ─────────────────────────── Membership plans ─────────────────────────────── */
// Prices from the old rafikihub.com join page.
export type Plan = { id: "basic" | "standard" | "premium"; name: string; priceKsh: number; months: number; label: string; highlighted?: boolean };
export const plans: Plan[] = [
  { id: "basic", name: "Basic", priceKsh: 250, months: 1, label: "per month" },
  { id: "standard", name: "Standard", priceKsh: 1250, months: 6, label: "for 6 months" },
  { id: "premium", name: "Premium", priceKsh: 2500, months: 12, label: "for 12 months", highlighted: true },
];
export const perMonth = (p: Plan) => Math.round(p.priceKsh / p.months);
export const savingVsBasic = (p: Plan) => plans[0].priceKsh * p.months - p.priceKsh;

/** What every membership includes (from the old join page) */
export const membershipIncludes = [
  "A full profile with headshots, credits, showreels and voice clips",
  "Seen by the industry professionals who use RafikiHub every day",
  "Submit your RafikiHub link for roles instantly",
  "Castings from directors across Kenya and Africa",
  "Invitations to workshops, events and career advice",
];

/** "How RafikiHub works" benefits on the Join page */
export const joinBenefits = [
  { title: "Your professional profile", text: "Headshots, credits, showreel, voice reel, skills and measurements in one link you can send anywhere." },
  { title: "Castings that match you", text: "Breakdowns from casting directors reach you when you fit the role. Submit in a couple of clicks." },
  { title: "Searchable by casting teams", text: "Casting directors filter by playing age, look, skills, languages and accents, so the right roles find you." },
  { title: "Workshops and masterclasses", text: "Train with working actors, directors and crew through RafikiHub workshops and the Video Library." },
  { title: "Headshot days and showreels", text: "Book Sio Bahati Services for headshots, showreels and audition prep." },
  { title: "A route to representation", text: "Members can be considered for RafikiHub Talent Management, our agency for a select group of actors." },
];

/* ─────────────────────────────── Video Library ────────────────────────────── */
// Add videos from the RafikiHub YouTube channel. youtubeId is the part after "v=" in the link.
export type Video = { youtubeId: string; title: string; category: string; instructor?: string; duration?: string };
export const videos: Video[] = [
  // { youtubeId: "xxxxxxxxxxx", title: "Self-tape auditions that get callbacks", category: "Acting", instructor: "Name", duration: "12 min" },
];

/* ───────────────────────────── Contact Listings ───────────────────────────── */
// The directory of industry contacts ("Rafiki Data Bank") from the old site.
export type ContactListing = {
  name: string;
  type: "Agent" | "Casting director" | "Production company" | "Photographer" | "Training" | "Service";
  location: string;
  description: string;
  website?: string;
  email?: string;
  phone?: string;
  /** Enhanced listings appear first and are highlighted */
  enhanced?: boolean;
};
export const contactListingTypes: ContactListing["type"][] = ["Agent", "Casting director", "Production company", "Photographer", "Training", "Service"];
export const contactListings: ContactListing[] = [
  {
    name: "RafikiHub Talent Management",
    type: "Agent",
    location: "Nairobi, Kenya",
    description: "Agency representing a select group of actors across film, TV, theatre, radio and commercials.",
    email: "talent@rafikihub.com",
    enhanced: true,
  },
  // Add more listings here, or move them into the database when the directory grows.
];

/* ───────────────────────────────── Locations ──────────────────────────────── */
// Where RafikiHub works. Add member counts only if you have real figures.
export type Location = { city: string; country: string; note: string; image: Maybe<string>; isHq?: boolean };
export const locations: Location[] = [
  { city: "Nairobi", country: "Kenya", note: "Headquarters, workshops and headshot days at Park Place, Parklands.", image: "/images/legacy/nairobi.jpg", isHq: true },
  { city: "East Africa", country: "Regional", note: "Performers, crew and productions across the region.", image: null },
  { city: "Across Africa", country: "Continental", note: "Talent and castings from across the continent.", image: null },
  { city: "International", country: "UK, US and more", note: "Projects with production companies from the UK, US and South Africa.", image: null },
];
