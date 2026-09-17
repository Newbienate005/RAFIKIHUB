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
