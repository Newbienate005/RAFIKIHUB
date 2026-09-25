export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "What is RafikiHub?",
    a: "RafikiHub is a casting platform based in Nairobi, Kenya. It connects actors, models, performers and other creatives across Kenya, East Africa and Africa with casting directors, agents and producers working in film, television, theatre and commercials.",
  },
  {
    q: "How does casting work on RafikiHub?",
    a: "Casting directors post breakdowns for the roles they are casting. The breakdowns go to registered agents and talent. Agents submit their clients and performers submit themselves. The casting director reviews the submissions and invites a shortlist to audition.",
  },
  {
    q: "Who can join RafikiHub?",
    a: "Actors, young performers, independent performers, models, dancers, voice artists, fashion stylists, fashion designers, make-up artists, owners of trained pets and animals, studio spaces, and agents. Casting directors and producers can join to post castings and search the talent database.",
  },
  {
    q: "Why do casting directors use RafikiHub?",
    a: "It is the quickest way to get casting and audition information straight to agents and talent. Every performer has a searchable profile with headshots, credits, showreels, voice clips and skills, so casting directors can find and shortlist people in one place.",
  },
  {
    q: "How do I start a career in acting in Kenya?",
    a: "Train and build experience first. Many actors begin in small, low-budget stage or film productions, then move to bigger jobs as their credits grow. Acting workshops sharpen your technique and connect you with people who can help your career.",
  },
  {
    q: "What makes a good acting headshot?",
    a: "A recent, natural head-and-shoulders photo that looks like you do today. Keep clothing simple, avoid props, hats and busy backgrounds, and make sure your eyes are clearly visible. Casting directors see headshots in a grid, so it must be sharp and professional, never blurry or pixelated.",
  },
  {
    q: "How do I choose a headshot photographer?",
    a: "Choose a photographer who shoots performers, not one who mainly photographs musicians or events. Ask to see previous headshots, ask other performers who they used, and get a full price and package breakdown before you book.",
  },
  {
    q: "How should I apply for a role?",
    a: "Unless the breakdown says otherwise, submit yourself through RafikiHub. Casting directors don't want printed CVs, phone calls or direct emails. Everything they need is on your profile and in the message you include with your submission.",
  },
  {
    q: "Why doesn't a casting breakdown show the casting director's details?",
    a: "This is normal. Many casting professionals leave their details out to avoid being flooded with messages, or because parts of the project aren't public yet. If you suit the role, submit as usual and you'll receive more information if you're invited to audition.",
  },
  {
    q: "Will I hear back if I'm not successful?",
    a: "Not always. Casting directors will contact you if they want you to audition. If you don't hear back, you weren't selected on that occasion. Some let unsuccessful applicants know, depending on their workload and the number of submissions.",
  },
  {
    q: "Can I share casting information with friends?",
    a: "No. Casting information on RafikiHub is private and confidential. Sharing it outside the platform breaches the production's copyright and RafikiHub's terms, and any member found circulating casting information will have their membership terminated.",
  },
  {
    q: "Can my pet be cast in a commercial or film?",
    a: "Yes. Productions sometimes need animals with a specific breed, look or temperament for shoots, commercials, TV and film. If your pet is well trained, you can register it as a pet model and submit it for castings.",
  },
  {
    q: "How do I contact RafikiHub?",
    a: "Email info@rafikihub.com or call +254 114 011 932. For agent representation, email talent@rafikihub.com.",
  },
];

export const categories = [
  { name: "Actors", text: "Film, TV, theatre, radio and commercial work." },
  { name: "Young performers", text: "Child and teen talent, registered by a parent or guardian." },
  { name: "Independent performers", text: "Dancers, puppeteers, voice artists, presenters and more." },
  { name: "Models", text: "Fashion, commercial and print campaigns." },
  { name: "Stylists and designers", text: "Fashion stylists and designers for shoots and productions." },
  { name: "Make-up artists", text: "Beauty, film make-up and special effects." },
  { name: "Pet models", text: "Well-trained animals for shoots, ads and screen work." },
  { name: "Studio spaces", text: "Rehearsal rooms, studios and locations to hire." },
  { name: "Agents", text: "Submit your clients directly to live castings." },
];

export const castingSteps = [
  { title: "A casting director posts a breakdown", text: "Role descriptions, dates and requirements go out through RafikiHub." },
  { title: "Agents and talent receive it", text: "Registered agents and matching performers get the breakdown directly." },
  { title: "Submissions arrive in one place", text: "Agents submit clients and performers submit their own profiles." },
  { title: "The shortlist is invited to audition", text: "The casting director reviews profiles and invites the right people in." },
];

export type Testimonial = { name: string; role: string; quote: string };

export const testimonials: Testimonial[] = [
  { name: "June Wekesa", role: "Actress", quote: "It has been a great pleasure working with you, and we greatly appreciate the chance you gave us to be a part of your team." },
  { name: "Sam Wachira", role: "Independent performer", quote: "If you are a performer in the arts looking for a place to market yourself, I've got one word for you: RafikiHub! It's the first of its kind here." },
  { name: "Brenda Ngeso", role: "Actress", quote: "This is a very helpful platform and more professional in terms of artistic growth and management. It helps in sourcing out actors and performers." },
  { name: "Bob Zenga", role: "Actor", quote: "RafikiHub is one of the best platforms an artist needs to be on. Getting an opportunity here as a puppeteer is always an experience." },
  { name: "Olivia Makena Makau", role: "Actress", quote: "To describe RafikiHub in three words: friendly, nurturing, peak professionalism. That's four words." },
  { name: "Tasiana Kalimbo", role: "Actress", quote: "RafikiHub has been nurturing people with skills all over the world. You are free to join." },
  { name: "Mirell Nazi", role: "Independent performer", quote: "I found RafikiHub at a time in my life when I was going through a journey of self-discovery. Their workshops have definitely been an important part of it." },
  { name: "Derrick Kinyanjui", role: "Actor", quote: "The profile setup that lets you package yourself fully as an artist really stands out to me." },
  { name: "Seda Nigel", role: "Actor", quote: "Rafiki… Rafiki… Rafiki. This is the place to be. I came across RafikiHub way back and it didn't take long for me to be noticed." },
  { name: "Lucy Maina", role: "Actress", quote: "RafikiHub offers plenty of opportunities for creatives to hone their skills. Working with Kate Snow has honestly been a game changer." },
];

export const team = [
  {
    name: "Kate Snow",
    role: "Founder and CEO",
    bio: [
      "Kate studied at Lewisham College from 2009, earning a BTEC National Diploma in Performing Arts, then trained at Arts Educational Schools in Chiswick, London, graduating with a BA (Hons) in Acting for Film and Television.",
      "She worked as an actress in London for several years, represented by John Doe Management, before returning home to Kenya in 2017 to continue her acting career, with roles including the film You Again and the short film Relationship Goals.",
      "Kate founded RafikiHub to empower, educate and nurture Kenyan and African artists on their way to professional careers. Through training, mentoring, casting and talent management, RafikiHub has worked with production companies from the UK, US and South Africa.",
    ],
    imageKey: "kateSnow" as const,
  },
];

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  author: string;
  body: { heading?: string; text: string }[];
};

export const posts: Post[] = [
  {
    slug: "how-to-get-a-great-acting-headshot",
    title: "How to get an acting headshot that gets you called in",
    description: "What casting directors look for in a headshot, and how to choose the right photographer in Kenya.",
    date: "2026-09-01",
    author: "RafikiHub",
    body: [
      { text: "Your headshot is the first thing a casting director sees when you apply for a role. On RafikiHub, profiles are viewed in a grid, so yours has a second or two to make someone click." },
      { heading: "What a good headshot looks like", text: "It is recent, natural and shows you as you look today. It is a head-and-shoulders shot with simple clothing and a plain background. No props, hats or heavy accessories. Your eyes are your most important feature, so they should be sharp and clearly visible." },
      { heading: "What to avoid", text: "Blurry, pixelated or obviously amateur photos make you look unprofessional. So do heavy filters and styling that doesn't look like you. A casting director wants to see the real you walk through the door." },
      { heading: "Choosing a photographer", text: "Pick someone who photographs performers, not mainly musicians or events. Ask to see their previous headshots, and ask other actors whose photos you like who they used. Before you book, get a clear breakdown of the price, the number of looks and the number of edited images." },
    ],
  },
  {
    slug: "how-casting-works-on-rafikihub",
    title: "How casting works on RafikiHub, step by step",
    description: "From breakdown to audition: what happens after a casting director posts a role, and how to submit well.",
    date: "2026-08-15",
    author: "RafikiHub",
    body: [
      { text: "Casting directors across Africa use RafikiHub to send out breakdowns for the roles they're casting. Here's what happens next, and how to give yourself the best chance." },
      { heading: "1. The breakdown goes out", text: "Breakdowns go straight to registered agents and to talent who match. Some leave out the casting director's name. That's normal: it stops them being flooded with messages, or protects project details that aren't public yet." },
      { heading: "2. You or your agent submit", text: "Submit through RafikiHub unless the breakdown says otherwise. Don't send printed CVs, call or email the casting director directly. Your profile, with headshots, credits, showreel and skills, is what they'll look at." },
      { heading: "3. The shortlist is invited to audition", text: "The casting director reviews submissions and invites a shortlist. If you don't hear back, you weren't picked this time. Keep your profile fresh and keep applying." },
      { heading: "Keep castings confidential", text: "Casting information on RafikiHub is private. Sharing it outside the platform breaks the production's copyright and our terms, and leads to membership being terminated." },
    ],
  },
  {
    slug: "lucy-maina-rafikihub-member-and-talent",
    title: "Lucy Maina: RafikiHub member and represented talent",
    description: "Actress Lucy Maina on mentorship, headshots and workshops with RafikiHub Talent Management.",
    date: "2024-03-26",
    author: "RafikiHub",
    body: [
      { text: "Talent management platforms like RafikiHub, founded by Kate Snow, are changing how Kenyan actors build careers in film and TV. Members get acting mentorship, help preparing headshots and reels, and networking events with working professionals." },
      { text: "Actress Lucy Maina is both a member and represented by RafikiHub Talent Management. She has taken part in several RafikiHub workshops and headshot sessions, and her most recent headshots were shot with Kate." },
    ],
  },
];
