export const site = {
  name: "RafikiHub",
  legalName: "RafikiHub Arts Limited",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://rafikihub.com").replace(/\/$/, ""),
  tagline: "Kenya's casting platform for performers and casting professionals",
  description:
    "RafikiHub is a Nairobi-based casting platform that connects actors, models, performers and crew across Kenya and Africa with casting directors, agents and producers for film, TV, theatre and commercials.",
  email: "info@rafikihub.com",
  talentEmail: "talent@rafikihub.com",
  phone: "+254114011932",
  phoneDisplay: "+254 (0) 114 011 932",
  address: {
    building: "Park Place Business Centre",
    street: "Park Place Building, 2nd Floor",
    area: "Parklands",
    city: "Nairobi",
    region: "Nairobi County",
    country: "KE",
    countryName: "Kenya",
  },
  city: "Nairobi",
  region: "Nairobi County",
  country: "KE",
  founder: "Kate Snow",
  memberCount: "65,000+",
  social: {
    instagram: "https://www.instagram.com/rafikihub/",
    facebook: "https://www.facebook.com/rafikihub.theplatform",
    youtube: "https://www.youtube.com/channel/UCxTTXLaw_uyEDCnlAfoHROA",
    linkedin: "https://www.linkedin.com/company/rafikihub-com/",
  },
};

export type NavLink = { href: string; label: string };
export type NavGroup = { label: string; items: NavLink[] };
export type NavItem = NavLink | NavGroup;
export const isGroup = (n: NavItem): n is NavGroup => "items" in n;

/** Header menu, mirroring the old rafikihub.com header as rebuilt in the Figma design. */
export const navLeft: NavItem[] = [
  { label: "About Us", items: [{ href: "/about", label: "About Us" }, { href: "/team", label: "Our Team" }] },
  { href: "/talent-management", label: "Talent Management" },
  { href: "/blog", label: "Blog" },
];

export const navRight: NavItem[] = [
  {
    label: "Resource Hub",
    items: [
      { href: "/videos", label: "Video Library" },
      { href: "/contact-listings", label: "Contact Listings" },
      { href: "/services", label: "Sio Bahati Services" },
      { href: "/locations", label: "RafikiHub Locations" },
      { href: "/resources", label: "Resources" },
    ],
  },
  { href: "/membership", label: "Options" },
];

/** Grouped menu for the mobile drawer */
export const drawerGroups: NavGroup[] = [
  {
    label: "About Us",
    items: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About Us" },
      { href: "/team", label: "Our Team" },
      { href: "/talent-management", label: "Talent Management" },
      { href: "/blog", label: "Blog" },
    ],
  },
  { label: "Resource Hub", items: (navRight[0] as NavGroup).items },
  {
    label: "Get started",
    items: [
      { href: "/join", label: "Join Now" },
      { href: "/membership", label: "Membership Options" },
      { href: "/casting", label: "Post a Casting" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    label: "The Small Print",
    items: [
      { href: "/faq", label: "RafikiHub Help & FAQ" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
    ],
  },
];
