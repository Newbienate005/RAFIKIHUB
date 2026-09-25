export const site = {
  name: "RafikiHub",
  legalName: "RafikiHub",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://rafikihub.com").replace(/\/$/, ""),
  tagline: "Kenya's casting platform for performers and casting professionals",
  description:
    "RafikiHub is a Nairobi-based casting platform that connects actors, models, performers and creatives across Kenya and Africa with casting directors, agents and producers for film, TV, theatre and commercials.",
  email: "info@rafikihub.com",
  talentEmail: "talent@rafikihub.com",
  phone: "+254114011932",
  phoneDisplay: "+254 114 011 932",
  city: "Nairobi",
  region: "Nairobi County",
  country: "KE",
  founder: "Kate Snow",
  memberCount: "65,000+",
  social: {
    facebook: "https://www.facebook.com/rafikihub.theplatform",
  },
};

export const nav = [
  { href: "/join", label: "Join as talent" },
  { href: "/casting", label: "Cast a project" },
  { href: "/talent-management", label: "Talent management" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Advice" },
  { href: "/faq", label: "FAQ" },
];
