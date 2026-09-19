// Mirrors the real rafikihub.com's data/files/countries.php list — used by
// the homepage hero's quick-start signup panel (and reusable anywhere else
// a country picker is needed).
export const countries = [
  'Kenya', 'Nigeria', 'Ghana', 'South Africa', 'Tanzania', 'Uganda', 'Senegal',
  'Ethiopia', 'Rwanda', 'Egypt', 'Morocco', 'United Kingdom', 'United States',
  'Canada', 'Other',
]

export interface Artist {
  id: string
  name: string
  category: 'Performer' | 'Agent' | 'Crew' | 'Casting Professional' | 'Young Performer' | 'Pet Performer'
  location: string
  country: string
  image: string
  bio: string
  skills: string[]
  featured?: boolean
}

export interface BlogPost {
  id: string
  title: string
  category: string
  excerpt: string
  image: string
  author: string
  date: string
  readTime: number
  featured?: boolean
}

export interface Testimonial {
  id: string
  name: string
  photo: string
  quote: string
  role: string
  location: string
}

export interface LocationCity {
  id: string
  city: string
  country: string
  image: string
  memberCount: number
}

export interface Plan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  highlighted?: boolean
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  photo: string
}

export interface VideoItem {
  id: string
  title: string
  thumbnail: string
  category: string
  duration: string
  instructor: string
}

export interface TimelineItem {
  id: string
  year: string
  title: string
  tagline: string
  body: string[]
}

const seed = (name: string, w = 600, h = 600) => `https://picsum.photos/seed/${name}/${w}/${h}`

export const artists: Artist[] = [
  {
    id: 'amara-diallo',
    name: 'Amara Diallo',
    category: 'Performer',
    location: 'Dakar → Amsterdam',
    country: 'Senegal',
    image: 'https://images.unsplash.com/photo-1761666519794-ad6fbcef058b?w=400&h=400&fit=crop&auto=format',
    bio: 'Dancer and choreographer blending Sabar traditions with contemporary movement.',
    skills: ['Dance', 'Choreography', 'Sabar'],
    featured: true,
  },
  {
    id: 'kwame-asante',
    name: 'Kwame Asante',
    category: 'Crew',
    location: 'Accra',
    country: 'Ghana',
    image: 'https://images.unsplash.com/photo-1781263378223-1e09658a7567?w=400&h=400&fit=crop&auto=format',
    bio: 'Lighting designer and stage manager for touring theatre productions.',
    skills: ['Lighting Design', 'Stage Management'],
    featured: true,
  },
  {
    id: 'zara-okafor',
    name: 'Zara Okafor',
    category: 'Performer',
    location: 'Lagos → Toronto',
    country: 'Nigeria',
    image: 'https://images.unsplash.com/photo-1779950658150-ad09947dd6c2?w=400&h=400&fit=crop&auto=format',
    bio: 'Filmmaker and actor working across Nollywood and diaspora short film.',
    skills: ['Acting', 'Directing', 'Screenwriting'],
    featured: true,
  },
  {
    id: 'thandiwe-moyo',
    name: 'Thandiwe Moyo',
    category: 'Agent',
    location: 'Harare',
    country: 'Zimbabwe',
    image: seed('thandiwe-moyo', 400, 400),
    bio: 'Talent agent representing musicians and voice artists across Southern Africa.',
    skills: ['Talent Representation', 'Contracts'],
  },
  {
    id: 'ibrahim-toure',
    name: 'Ibrahim Touré',
    category: 'Casting Professional',
    location: 'Bamako',
    country: 'Mali',
    image: seed('ibrahim-toure', 400, 400),
    bio: 'Casting director for film and commercial productions across West Africa.',
    skills: ['Casting', 'Production Coordination'],
  },
  {
    id: 'naledi-khumalo',
    name: 'Naledi Khumalo',
    category: 'Young Performer',
    location: 'Johannesburg',
    country: 'South Africa',
    image: seed('naledi-khumalo', 400, 400),
    bio: '14-year-old vocalist and musical theatre performer.',
    skills: ['Singing', 'Musical Theatre'],
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: 'knowledge-circles-launch',
    title: 'Inside the First Knowledge Circle Cohort',
    category: 'Community',
    excerpt: 'Twelve members, four countries, one shared curriculum — how our first peer-learning pod actually worked.',
    image: seed('blog-knowledge-circles', 800, 600),
    author: 'RafikiHub Editorial',
    date: 'Feb 3, 2026',
    readTime: 6,
    featured: true,
  },
  {
    id: 'ubuntu-grants-recipients',
    title: 'Meet the First Ubuntu Grant Recipients',
    category: 'Funding',
    excerpt: 'Six creators, no gatekeepers — a look at what community-funded micro-grants made possible this quarter.',
    image: seed('blog-ubuntu-grants', 800, 600),
    author: 'Amara Diallo',
    date: 'Jan 22, 2026',
    readTime: 5,
  },
  {
    id: 'diaspora-chapter-lagos',
    title: 'How the Toronto Chapter Found Its Footing',
    category: 'Diaspora',
    excerpt: 'From a WhatsApp group of six to a 400-person chapter with a monthly residency night.',
    image: seed('blog-toronto-chapter', 800, 600),
    author: 'Zara Okafor',
    date: 'Jan 10, 2026',
    readTime: 4,
  },
  {
    id: 'casting-call-etiquette',
    title: 'Casting Call Etiquette, From a Casting Director',
    category: 'Careers',
    excerpt: 'Ibrahim Touré on what actually gets a callback, and what quietly gets you passed over.',
    image: seed('blog-casting-etiquette', 800, 600),
    author: 'Ibrahim Touré',
    date: 'Dec 2, 2025',
    readTime: 5,
  },
  {
    id: 'young-performers-programme',
    title: 'Building a Safe Stage for Young Performers',
    category: 'Community',
    excerpt: 'The safeguarding standards behind our Young Performers programme — and why they\'re non-negotiable.',
    image: seed('blog-young-performers', 800, 600),
    author: 'RafikiHub Editorial',
    date: 'Nov 14, 2025',
    readTime: 4,
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 't-amara',
    name: 'Amara Diallo',
    photo: 'https://images.unsplash.com/photo-1761666519794-ad6fbcef058b?w=200&h=200&fit=crop&auto=format',
    quote: 'RafikiHub gave me a professional home when I moved abroad. I found my co-founder here — and my closest friends.',
    role: 'Dancer & Choreographer',
    location: 'Dakar → Amsterdam',
  },
  {
    id: 't-kwame',
    name: 'Kwame Asante',
    photo: 'https://images.unsplash.com/photo-1781263378223-1e09658a7567?w=200&h=200&fit=crop&auto=format',
    quote: 'The knowledge circles connected me with farmers in Senegal and engineers in Kenya. We built something none of us could have done alone.',
    role: 'Agri-tech Entrepreneur',
    location: 'Accra',
  },
  {
    id: 't-zara',
    name: 'Zara Okafor',
    photo: 'https://images.unsplash.com/photo-1779950658150-ad09947dd6c2?w=200&h=200&fit=crop&auto=format',
    quote: 'I published my first short film through RafikiHub. It reached 40,000 people in a week. The community showed up in ways I never expected.',
    role: 'Filmmaker',
    location: 'Lagos → Toronto',
  },
]

export const locations: LocationCity[] = [
  { id: 'nairobi', city: 'Nairobi', country: 'Kenya', image: seed('city-nairobi', 700, 500), memberCount: 8200 },
  { id: 'lagos', city: 'Lagos', country: 'Nigeria', image: seed('city-lagos', 700, 500), memberCount: 14500 },
  { id: 'accra', city: 'Accra', country: 'Ghana', image: seed('city-accra', 700, 500), memberCount: 6100 },
  { id: 'johannesburg', city: 'Johannesburg', country: 'South Africa', image: seed('city-joburg', 700, 500), memberCount: 9800 },
  { id: 'london', city: 'London', country: 'United Kingdom', image: seed('city-london', 700, 500), memberCount: 5200 },
  { id: 'toronto', city: 'Toronto', country: 'Canada', image: seed('city-toronto', 700, 500), memberCount: 3400 },
]

export const plans: Plan[] = [
  {
    id: 'community',
    name: 'Community',
    price: 0,
    period: 'forever',
    features: ['Public profile page', 'Browse castings', 'Join Knowledge Circles', 'Community forums'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 12,
    period: 'month',
    features: ['Everything in Community', 'Priority casting alerts', 'Verified badge'],
    highlighted: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 45,
    period: 'month',
    features: ['Everything in Professional', 'Manage multiple talent profiles', 'Bulk casting submissions', 'Dedicated support'],
  },
  {
    id: 'corporate',
    name: 'Corporate & Partner',
    price: 150,
    period: 'month',
    features: ['Everything in Agency', 'Sponsorship placement', 'Custom reporting', 'Account manager'],
  },
]

export const faqs: FaqItem[] = [
  { id: 'f1', category: 'Membership', question: 'Is RafikiHub free to join?', answer: 'Yes — the Community plan is free forever. Paid plans unlock priority casting alerts and verified badges.' },
  { id: 'f2', category: 'Membership', question: 'Do I need to be based in Africa to join?', answer: 'No. RafikiHub is for the continent and its diaspora — members join from over 60 countries.' },
  { id: 'f7', category: 'Membership', question: 'Do I need prior experience to join as a Performer?', answer: 'You qualify with one paid performance credit, a recognised training programme, or a recommendation from a verified member, agent, or partner organisation. See the eligibility pathways on the Join page for details.' },
  { id: 'f8', category: 'Membership', question: 'What if I don’t have an agent yet?', answer: 'That’s fine — most members join self-represented. Opt in to Talent Scout on your profile and verified agents can discover and reach out to you directly.' },
  { id: 'f5', category: 'Castings', question: 'How do casting calls work?', answer: 'Agents and casting professionals post opportunities; performers with a matching profile get notified and can apply directly.' },
  { id: 'f6', category: 'Safety', question: 'What safeguards exist for Young Performers?', answer: 'All Young Performer accounts require guardian verification, and every casting involving a minor is reviewed by our safeguarding team.' },
]

export const team: TeamMember[] = [
  { id: 'm1', name: 'Fatima Nkurunziza', role: 'Founder & CEO', photo: seed('team-fatima', 400, 400) },
  { id: 'm2', name: 'David Mensah', role: 'Head of Community', photo: seed('team-david', 400, 400) },
  { id: 'm3', name: 'Sarah Wanjiru', role: 'Community Programs Lead', photo: seed('team-sarah', 400, 400) },
  { id: 'm4', name: 'Emeka Chukwu', role: 'Casting & Partnerships', photo: seed('team-emeka', 400, 400) },
  { id: 'm5', name: 'Layla Haddad', role: 'Design Lead', photo: seed('team-layla', 400, 400) },
  { id: 'm6', name: 'Joseph Njogu', role: 'Engineering Lead', photo: seed('team-joseph', 400, 400) },
]

// Shared between AboutPage's full "RafikiHub — Our Journey" timeline and the
// condensed teaser featured on the Homepage.
export const timeline: TimelineItem[] = [
  {
    id: 'launch',
    year: '2021',
    title: 'RafikiHub Launch',
    tagline: 'RafikiHub is born in Kenya.',
    body: [
      'After returning to Kenya in 2021, Kate Snow launches RafikiHub with a vision of creating opportunities and spaces for people to connect through the arts.',
    ],
  },
  {
    id: 'community',
    year: '2021',
    title: 'Building the Creative Community',
    tagline: 'Growing the network.',
    body: [
      'RafikiHub begins connecting with actors, filmmakers, creatives and organisations, creating a growing community around the arts.',
      'Workshops by Charles J. Ouda on acting, Teddy Mungai on script supervising, and Emmanuel Mugo on stunt coordination are launched, alongside others facilitated by Jazz Moll, Akinyi Oluoch and Martin Kigondu.',
    ],
  },
  {
    id: 'partnerships',
    year: '2022',
    title: 'Major Partnerships',
    tagline: 'RafikiHub goes global.',
    body: [
      'RafikiHub partners with South African animation studio Triggerfish, UK production house Blink, and US studio Disney to collaborate on its first international project.',
    ],
  },
  {
    id: 'connections',
    year: '2023',
    title: 'Deepening Industry Connections',
    tagline: 'From projects to programmes.',
    body: [
      'RafikiHub strengthens relationships with artists, industry professionals, organisations and creative institutions — including the AFFC / Storytellers Film Lab.',
    ],
  },
  {
    id: 'expansion',
    year: '2024',
    title: 'Expanding Our Work',
    tagline: 'Building bridges across the industry.',
    body: [
      'RafikiHub begins developing more structured opportunities for creatives to learn, collaborate and develop their careers.',
      'RafikiHub expands its programmes, partnerships and opportunities, bringing more creatives into its growing community.',
    ],
  },
  {
    id: 'kids',
    year: '2025',
    title: 'Investing in the Next Generation',
    tagline: 'RafikiHub Kids is born.',
    body: [
      'A new branch of RafikiHub is developed to use therapeutic drama and creative expression to support children\'s confidence, emotional development, creativity and connection.',
    ],
  },
  {
    id: 'ecosystem',
    year: '2026',
    title: 'Building the RafikiHub Ecosystem',
    tagline: 'Launching a new vision for RafikiHub — connecting talent, professional development, opportunities, storytelling and community in one creative ecosystem.',
    body: [
      'This is where Talent Profiles, Headshot Days, Industry Opportunities, Masterclasses, Film Labs, Creative Projects, and RafikiHub Kids all come together.',
    ],
  },
]

// Closing line for the full timeline on AboutPage — not shown in the
// condensed Homepage teaser.
export const timelineClosing = "The story isn't finished. We're still building. From one idea in 2017, to the launch of the platform in 2021, to a growing community of creatives, storytellers and young people, RafikiHub continues to evolve — and this is only the beginning."

// --- Member Dashboard mock data ---------------------------------------
// Mirrors the real rafikihub.com logged-in dashboard (dashboard/index.php):
// account settings, casting submissions, and a billing summary. No real
// auth/backend here — these are static, editable-in-memory mocks for the
// wireframe.

export interface CastingSubmission {
  id: string
  title: string
  project: string
  submittedDate: string
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Declined'
}

export interface BillingRecord {
  id: string
  date: string
  description: string
  amount: number
  status: 'Paid' | 'Due'
}

export const castingSubmissions: CastingSubmission[] = [
  { id: 'cs1', title: 'Lead Vocalist — Amapiano Festival Tour', project: 'Baraza Media Lab', submittedDate: 'Feb 12, 2026', status: 'Shortlisted' },
  { id: 'cs2', title: 'Background Dancer — Music Video', project: 'Africa Uncut Media', submittedDate: 'Feb 2, 2026', status: 'Reviewed' },
  { id: 'cs3', title: 'Voiceover Artist — Radio Drama', project: 'Multichoice Talent Factory', submittedDate: 'Jan 20, 2026', status: 'Pending' },
]

export const billingHistory: BillingRecord[] = [
  { id: 'b1', date: 'Feb 1, 2026', description: 'Professional plan — monthly', amount: 12, status: 'Paid' },
  { id: 'b2', date: 'Jan 1, 2026', description: 'Professional plan — monthly', amount: 12, status: 'Paid' },
  { id: 'b3', date: 'Dec 1, 2025', description: 'Professional plan — monthly', amount: 12, status: 'Paid' },
]

// --- Talent Manager dashboard mock data (Agent / Crew / Casting Professional) ---

export interface CastingCall {
  id: string
  title: string
  category: string
  applicants: number
  status: 'Open' | 'Closed'
  postedDate: string
}

export const talentRoster: Artist[] = [artists[0], artists[2], artists[5]]

export const castingCalls: CastingCall[] = [
  { id: 'cc1', title: 'Lead Vocalist — Amapiano Festival Tour', category: 'Performer', applicants: 24, status: 'Open', postedDate: 'Feb 10, 2026' },
  { id: 'cc2', title: 'Background Dancers (x6) — Music Video', category: 'Performer', applicants: 41, status: 'Open', postedDate: 'Feb 4, 2026' },
  { id: 'cc3', title: 'Voiceover Artist — Radio Drama', category: 'Performer', applicants: 9, status: 'Closed', postedDate: 'Jan 15, 2026' },
]

export const videos: VideoItem[] = [
  { id: 'v1', title: 'Sabar Fundamentals with Amara Diallo', thumbnail: seed('video-sabar', 640, 400), category: 'Dance', duration: '42 min', instructor: 'Amara Diallo' },
  { id: 'v2', title: 'Stage Lighting for Small Venues', thumbnail: seed('video-lighting', 640, 400), category: 'Crew', duration: '28 min', instructor: 'Kwame Asante' },
  { id: 'v3', title: 'Self-Tape Auditions That Get Callbacks', thumbnail: seed('video-selftape', 640, 400), category: 'Acting', duration: '35 min', instructor: 'Zara Okafor' },
  { id: 'v4', title: 'Voice Care for Touring Performers', thumbnail: seed('video-voice', 640, 400), category: 'Voice', duration: '19 min', instructor: 'Thandiwe Moyo' },
  { id: 'v5', title: 'Casting Directors Explain Callbacks', thumbnail: seed('video-casting', 640, 400), category: 'Careers', duration: '31 min', instructor: 'Ibrahim Touré' },
  { id: 'v6', title: 'Musical Theatre Basics for Young Performers', thumbnail: seed('video-young', 640, 400), category: 'Young Performers', duration: '24 min', instructor: 'Naledi Khumalo' },
]

// ===========================================================================
// Real-site parity data — added when the Dashboard/Register/Join/Options/
// Locations/Contacts/Profile pages were rebuilt to match rafikihub.com's
// actual PHP source (dashboard/index.php, register.php, join-now.php,
// options.php, locations.php, contacts.php, profile.php) instead of the
// originally-invented wireframe content. See RafikiHub_Audit_and_Fixes.md-
// style research notes in project history for the full page-by-page diff.
//
// A few of these lists are marked "DB-driven, no static fallback in the
// real code" — the live site pulls them from MySQL tables (plans,
// plan_categories, users, locations) with no hardcoded backup anywhere in
// the PHP. Those are necessarily best-effort static approximations here,
// since this project has no backend. Everything else (countries, the CV
// attribute selects, membership category bullet copy) is a faithful,
// near-verbatim match to static HTML/PHP that really exists on the site.
// ===========================================================================

// Full country list, matching the real site's data/files/countries.php
// (a standard ~195-country picker) used on the quick-signup modal, the
// full Register form, and the Locations scouting-request form.
export const fullCountryList = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Brazzaville)', 'Congo (DRC)', 'Costa Rica', "Côte d'Ivoire",
  'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
  'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
  'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain',
  'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
  'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
]

// --- Membership Options & Categories (join-now.php / options.php / register.php) ---
// DB-driven on the real site (plans / plan_categories tables) — best-effort
// static approximation. The 8 top-level cards and their bullet copy below
// ARE the real, static marketing copy from join-now.php / options.php.

export interface MembershipCard {
  option: string
  bullets: string[]
  categories?: string[]
  criteria?: string[]
}

export const membershipCards: MembershipCard[] = [
  {
    option: 'Performers',
    bullets: [
      'Build a full professional profile, headshots and multimedia included.',
      "Your online profile can be seen by all of the industry professionals who use RafikiHub's online services daily.",
    ],
    categories: [
      'Actor', 'Actress', 'Dancer', 'Fashion Designer', 'Fashion Stylist',
      'Independent Performer', 'Make-Up Artist', 'Model', 'Musician', 'Photographer',
    ],
  },
  {
    option: 'Agents',
    bullets: [
      'Join RafikiHub to give your clients access to the best roles in television, film, theatre and commercials.',
      'Simplify the way you manage your clients, by submitting them for roles on RafikiHub and tracking responses in one place.',
    ],
  },
  {
    option: 'Casting Professionals',
    bullets: [
      'Specific search or browse our database of talented performers.',
      'Send out casting briefs and receive submissions.',
      'Easily manage audition lists, and capture and share audition footage.',
    ],
  },
  {
    option: 'Young Performers',
    bullets: [
      "If you're between 4-18 years old and an aspiring performer, RafikiHub is the platform for you.",
      'Advice and support is provided for you as a young performer, as well as your parents or guardians.',
    ],
    categories: ['Young Performer'],
  },
  {
    option: 'Crew',
    bullets: [
      'Showcase your professional portfolio.',
      'Seen by all of the industry professionals who use RafikiHub daily.',
      'Submit your RafikiHub link for upcoming work instantly.',
      'Receive support with building out your production career.',
    ],
  },
  {
    option: 'Pets',
    bullets: [
      'Present your pet or animal to the industry by managing and updating their RafikiHub profile.',
      'Submit your pet for castings and auditions.',
      "Submit multimedia files of your pet's best tricks and abilities.",
    ],
  },
  {
    option: 'Corporates',
    bullets: [
      'Browse the database of talent.',
      'Engage/contact the database of talent directly.',
      'Create a casting/audition call out to source for a brand ambassador or similar.',
    ],
  },
  {
    option: 'Rooms & Studio',
    bullets: [
      'A platform to list and advertise your studio, space and/or rehearsal room.',
      'Link with like-minded industry projects that require a space like yours.',
      'A transparent, seamless way to be discovered by productions that need your space.',
    ],
    criteria: [
      'A reputable, creative space',
      'Professionally accredited space (e.g. proper soundproofing)',
      'Industry recognised/standard equipment',
      'Proof of property license and/or ownership (copy of lease or title)',
      'Company Registration documents for your space',
    ],
  },
]

export const wardrobeOptions = ['Fashion Stylist', 'Fashion Designer']
export const guardianOptions = ['Parent', 'Guardian']
export const genderOptions = ['Male', 'Female', 'Other']

// Maps a chosen Member Option to which of the 5 real role-based dashboard
// bodies (performers.php / agents-and-casting-body.php / production.php /
// pets-body.php / rooms-body.php) a new account lands on.
export type DashboardRole = 'performer' | 'casting' | 'crew' | 'pet' | 'rooms'

export function roleForMemberOption(option: string): DashboardRole {
  switch (option) {
    case 'Agents':
    case 'Casting Professionals':
    case 'Corporates':
      return 'casting'
    case 'Crew':
      return 'crew'
    case 'Pets':
      return 'pet'
    case 'Rooms & Studio':
      return 'rooms'
    default:
      return 'performer' // Performers, Young Performers
  }
}

// --- CV / "Edit CV" attribute selects (dashboard/index.php performer EDIT CV tab) ---
// These option sets are static in the real code (hardcoded <option> lists).

export const appearanceOptions = [
  'Black - Other Areas', 'Black - Caribbean', 'Black - African', 'Black - American', 'Mixed Race',
  'Scandinavian', 'White', 'Eastern European', 'East Asia', 'Pakistan', 'Asian', 'Indian',
  'Filipino/Malay/Thai', 'Chinese', 'Japanese', 'Korean', 'Maori', 'Latin American', 'Hispanic',
  'Native American',
]
export const eyeColorOptions = [
  'Black', 'Blue', 'Brown', 'Green', 'Grey', 'Hazel', 'Blue-Green', 'Blue-Grey', 'Grey-Green',
  'Light Blue', 'Heterochromia/Mixed',
]
export const hairColorOptions = [
  'Auburn', 'Dark Brown', 'Blond(e)', 'Grey', 'Red/Titian', 'Light/Mid Brown', 'Black', 'White',
  'Greying', 'Fair', 'Silver', 'Strawberry Blond(e)', 'Salt & Pepper', 'Sandy', 'Blond(e) - Dark',
  'Blond(e) - Medium',
]
export const hairLengthOptions = ['Short', 'Mid Length', 'Long', 'Bald', 'Balding', 'Shaved']
export const facialHairOptions = ['Beard', 'Moustache', 'Sideburns', 'Full Set', 'Goatee']

export const voiceQualityOptions = [
  'Breathy', 'Bright', 'Clear', 'Delicate', 'Gentle', 'Husky', 'Light', 'Low', 'Melodious', 'Nasal',
  'Piping', 'Sharp', 'Silky', 'Silvery', 'Smooth', 'Strong', 'Sweet', 'Tight', 'Velvety', 'Warm',
]
export const voiceCharacterOptions = [
  'Amused', 'Assured', 'Authoritative', 'Cool', 'Direct', 'Earthy', 'Engaging', 'Enthusiastic',
  'Friendly', 'Girlish', 'Intimate', 'Mature', 'Natural', 'Precise', 'Relaxed', 'Sensitive',
  'Serious', 'Sincere', 'Sympathetic', 'Twinkly',
]
export const lowVoiceOptions = ['Alto F3-D5', 'Bass E2-C4']
export const mediumVoiceOptions = ['Baritone G4-E2', 'Mezzo soprano A3-F5']
export const highVoiceOptions = ['Soprano C4-A5', 'Tenor B2-G4']

export const heightFeetOptions = ['2 ft', '3 ft', '4 ft', '5 ft', '6 ft', '7 ft', '8 ft']
export const heightInchesOptions = Array.from({ length: 12 }, (_, i) => `${i} in`)

export const distinguishingTraitOptions = ['Scar', 'Tattoo', 'Birthmark', 'Piercing', 'Mole', 'Freckles']
export const traitLocationOptions = ['Face', 'Neck', 'Arm', 'Hand', 'Leg', 'Torso', 'Back', 'Other']

// 8 skill categories from the "Skills & Links" pill, each with its own
// two-tier proficiency scale exactly as in the real CV editor.
export interface SkillCategoryDef {
  name: string
  proficiencyOptions: [string, string]
}
export const skillCategories: SkillCategoryDef[] = [
  { name: 'Accents & Dialects', proficiencyOptions: ['High Standard', 'Native'] },
  { name: 'Languages', proficiencyOptions: ['High Standard', 'Native'] },
  { name: 'Music & Dance', proficiencyOptions: ['Skilled', 'Highly Skilled'] },
  { name: 'Other Skills', proficiencyOptions: ['Skilled', 'Highly Skilled'] },
  { name: 'Performance', proficiencyOptions: ['Skilled', 'Highly Skilled'] },
  { name: 'Presenting', proficiencyOptions: ['Skilled', 'Highly Skilled'] },
  { name: 'Sports', proficiencyOptions: ['Skilled', 'Highly Skilled'] },
  { name: 'Vehicle Licences', proficiencyOptions: ['Skilled', 'Highly Skilled'] },
]

export interface SkillEntry {
  id: string
  category: string
  name: string
  proficiency: string
}

export interface TrainingRecord {
  id: string
  course: string
  institution: string
  startDate: string
  endDate: string
}

export interface CreditRecord {
  id: string
  title: string
  type: string
  productionYear: string
  role: string
  productionCompany: string
  director: string
}

export type DocStatus = 'Not Uploaded' | 'Pending' | 'Rejected' | 'Approved'

// The full "Edit CV" profile shape — mirrors dashboard/index.php's
// createTheCV form field-for-field (personal data, appearance, voice,
// vocal range, further measurements, skills, credits, training, about me).
export interface CvProfile {
  name: string
  website: string
  country: string
  phone: string
  idPassportNumber: string
  idPassportStatus: DocStatus
  kraTaxNumber: string
  kraTaxStatus: DocStatus
  physicalAddress: string
  email: string
  profileLinkSlug: string
  playingAgeFrom: string
  playingAgeTo: string
  dateOfBirth: string
  gender: string
  musicGenre: string
  heightFeet: string
  heightInches: string
  cities: string[]
  nationalities: string[]
  appearance: string
  eyeColor: string
  hairColor: string
  hairLength: string
  facialHair: string
  voiceQuality: string
  voiceCharacter: string
  lowVoice: string
  mediumVoice: string
  highVoice: string
  showFurtherMeasurements: boolean
  bustChest: string
  waist: string
  insideLeg: string
  insideArm: string
  collar: string
  hat: string
  weightKg: string
  shoeSize: string
  hips: string
  dressSize: string
  hasTwin: boolean
  distinguishingTraits: { trait: string; location: string }[]
  training: TrainingRecord[]
  educationCertificateStatus: DocStatus
  aboutMe: string
  skills: SkillEntry[]
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
  credits: CreditRecord[]
  profileComplete: number
  missingFields: string[]
}

export const demoCvProfile: CvProfile = {
  name: 'Amara Diallo',
  website: 'www.amaradiallo.africa',
  country: 'Senegal',
  phone: '+221 77 000 0000',
  idPassportNumber: 'SN0234871',
  idPassportStatus: 'Approved',
  kraTaxNumber: '',
  kraTaxStatus: 'Not Uploaded',
  physicalAddress: 'Plateau, Dakar, Senegal',
  email: 'amara.diallo@rafikihub.com',
  profileLinkSlug: 'amara-diallo',
  playingAgeFrom: '24',
  playingAgeTo: '32',
  dateOfBirth: '1996-05-14',
  gender: 'Female',
  musicGenre: 'Afrobeat, Sabar Percussion',
  heightFeet: '5 ft',
  heightInches: '6 in',
  cities: ['Dakar', 'Amsterdam'],
  nationalities: ['Senegalese'],
  appearance: 'Black - African',
  eyeColor: 'Brown',
  hairColor: 'Black',
  hairLength: 'Long',
  facialHair: '',
  voiceQuality: 'Warm',
  voiceCharacter: 'Engaging',
  lowVoice: '',
  mediumVoice: 'Mezzo soprano A3-F5',
  highVoice: '',
  showFurtherMeasurements: false,
  bustChest: '', waist: '', insideLeg: '', insideArm: '', collar: '', hat: '', weightKg: '', shoeSize: '', hips: '', dressSize: '',
  hasTwin: false,
  distinguishingTraits: [],
  training: [
    { id: 'tr1', course: 'Contemporary Choreography Intensive', institution: 'École des Sables', startDate: '2018-01', endDate: '2018-06' },
  ],
  educationCertificateStatus: 'Pending',
  aboutMe: 'Dancer and choreographer blending Sabar traditions with contemporary movement, performing and teaching across West Africa and Europe.',
  skills: [
    { id: 'sk1', category: 'Music & Dance', name: 'Sabar Dance', proficiency: 'Highly Skilled' },
    { id: 'sk2', category: 'Languages', name: 'Wolof', proficiency: 'Native' },
    { id: 'sk3', category: 'Languages', name: 'French', proficiency: 'High Standard' },
  ],
  facebookUrl: '', twitterUrl: '', instagramUrl: 'instagram.com/amaradiallo',
  credits: [
    { id: 'cr1', title: 'Sable Nights', type: 'Music Video', productionYear: '2025', role: 'Lead Dancer', productionCompany: 'Baraza Media Lab', director: 'Fatou Sy' },
  ],
  profileComplete: 72,
  missingFields: ['KRA/Tax Number', 'Further Measurements', 'Voiceover Reel'],
}

// --- Home tab stats (dashboard/index.php performers-body.php HOME tab) ---
// These four numbers are literally hardcoded in the real production HTML —
// not tied to the logged-in user or any live query — so they're reproduced
// as the same static numbers here rather than invented "realistic" ones.
export const dashboardHomeStats = { opportunities: 12, totalUsers: 2265, applications: 41, partners: 5 }

export interface CastingPosting {
  id: string
  reference: string
  castingTitle: string
  type: string
  status: 'Open' | 'Closed' | 'Under Review'
}
export const auditionsTable: CastingPosting[] = [
  { id: 'a1', reference: 'RH-2026-0142', castingTitle: 'Lead Vocalist — Amapiano Festival Tour', type: 'Music', status: 'Open' },
  { id: 'a2', reference: 'RH-2026-0139', castingTitle: 'Background Dancers (x6) — Music Video', type: 'Dance', status: 'Open' },
  { id: 'a3', reference: 'RH-2025-0987', castingTitle: 'Voiceover Artist — Radio Drama', type: 'Voiceover', status: 'Closed' },
]
export interface MyApplicationRow {
  id: string
  reference: string
  castingTitle: string
  type: string
  status: 'Applied' | 'Shortlisted' | 'Declined'
}
export const myApplicationsTable: MyApplicationRow[] = [
  { id: 'ap1', reference: 'RH-2026-0142', castingTitle: 'Lead Vocalist — Amapiano Festival Tour', type: 'Music', status: 'Shortlisted' },
  { id: 'ap2', reference: 'RH-2026-0130', castingTitle: 'Featured Extra — Feature Film', type: 'Film', status: 'Applied' },
]

export interface AgentRow { id: string; agentName: string; agentEmail: string; agentCountry: string; status: 'Active' | 'Pending' }
export const myAgentsTable: AgentRow[] = [
  { id: 'ag1', agentName: 'Thandiwe Moyo', agentEmail: 'thandiwe@rafikihub.com', agentCountry: 'Zimbabwe', status: 'Active' },
]
// The real "My Calendar" tab reuses the "My Agents" table's column headers
// verbatim (AGENT NAME / AGENT EMAIL / AGENT COUNTRY / STATUS) — a genuine
// copy-paste quirk in production. Kept here on purpose for fidelity rather
// than silently "fixed", per the same AgentRow shape.
export const myCalendarTable: AgentRow[] = myAgentsTable

export interface PerformersCornerRow { id: string; supplierName: string; training: string; type: string; charges: string }
export const performersCornerTable: PerformersCornerRow[] = [
  { id: 'pc1', supplierName: 'Nairobi Voice Studio', training: 'Voiceover Coaching', type: 'Training', charges: 'KSh 3,500/session' },
  { id: 'pc2', supplierName: 'Sable Photography', training: 'Headshot Package', type: 'Photography', charges: 'KSh 8,000' },
]

export interface InvoiceRow { id: string; invoiceName: string; invoiceNumber: string; invoiceDate: string; status: 'Paid' | 'Unpaid' | 'Draft' }
export const myInvoicesTable: InvoiceRow[] = [
  { id: 'inv1', invoiceName: 'Baraza Media Lab — Festival Tour', invoiceNumber: 'INV-2026-014', invoiceDate: 'Feb 14, 2026', status: 'Paid' },
]

export interface InvoiceLineItem { id: string; description: string; amount: number }

// --- Rooms & Studio (rooms-hire-template.php) ---
export interface RoomListingRow { id: string; reference: string; country: string; city: string; type: string; size: string }
export interface RoomBookingRow { id: string; reference: string; country: string; city: string; type: string; status: 'Pending' | 'Confirmed' | 'Declined' }
export interface RoomBookingRequestRow { id: string; reference: string; fullName: string; mobile: string; status: 'Pending' | 'Confirmed' | 'Declined' }

export const roomListingsTable: RoomListingRow[] = [
  { id: 'rl1', reference: 'RS-0021', country: 'Kenya', city: 'Nairobi', type: 'Rehearsal Room', size: '80 sqm' },
]
export const roomBookingsTable: RoomBookingRow[] = []
export const roomBookingRequestsTable: RoomBookingRequestRow[] = []

export const facilityTypeOptions = ['Rehearsal Room', 'Recording Studio', 'Photography Studio', 'Dance Studio', 'Event Space', 'Green Screen Studio']
export const chargeFrequencyOptions = ['Per Hour', 'Per Day', 'Per Week']
export const currencyOptions = ['KES', 'USD', 'NGN', 'ZAR', 'GHS', 'EUR', 'GBP']

// --- Locations scouting request form (locations.php) ---
export const intendedLocationOptions = [
  'Office Space', 'Village/Town', 'Housing (Apartment, House, Bungalow, etc.)',
  'In Nature (Forest, Mountain, Beach, River, Lake, Bush, Savannah, etc.)',
  'Sports Facility', 'Bars/Restaurants', 'Farms', 'Government Facility', 'Studio Space/Green Screen', 'Other',
]

// --- Contacts Listing directory (contacts.php, DB-driven: users with
// roles_id=2 i.e. Agents/Casting Professionals/Corporates, contact_listing
// opted-in, status not Expired/Blocked/Unverified) ---
export interface ContactDirectoryEntry { id: string; name: string; category: string }
export const contactDirectory: ContactDirectoryEntry[] = [
  { id: 'cd1', name: 'Thandiwe Moyo', category: 'Agent' },
  { id: 'cd2', name: 'Ibrahim Touré', category: 'Casting Professional' },
  { id: 'cd3', name: 'Baraza Media Lab', category: 'Corporate' },
  { id: 'cd4', name: 'Africa Uncut Media', category: 'Corporate' },
  { id: 'cd5', name: 'Fatou Sy Talent Agency', category: 'Agent' },
]
