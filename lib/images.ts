/**
 * Every image on the site is referenced from here.
 *
 * The photos were migrated from the old rafikihub.com: `npm run images:import` downloads them
 * into /public/images/legacy (not committed), then `node scripts/place-legacy-images.mjs`
 * resizes them into /public/images/{people,blog,sections,services,partners}.
 *
 * Any slot whose file doesn't exist yet shows a tidy placeholder instead of a broken image.
 */
export const images = {
  /** Leave as null to use the all-caps RAFIKIHUB wordmark. Set a path to use an image logo instead. */
  logo: null as string | null,

  // Hero contact sheet: six performer headshots
  hero: [
    { src: "/images/people/olivia-makena-makau.jpg", name: "Olivia Makena Makau", role: "Actress" },
    { src: "/images/people/sam-wachira.jpg", name: "Sam Wachira", role: "Independent performer" },
    { src: "/images/people/bob-zenga.jpg", name: "Bob Zenga", role: "Actor" },
    { src: "/images/people/lucy-maina.jpg", name: "Lucy Maina", role: "Actress" },
    { src: "/images/people/derrick-kinyanjui.jpg", name: "Derrick Kinyanjui", role: "Actor" },
    { src: "/images/people/mirell-nazi.jpg", name: "Mirell Nazi", role: "Independent performer" },
  ],

  sections: {
    performers: "/images/sections/performers.jpg",
    casting: "/images/sections/casting.jpg",
    workshop: "/images/sections/workshop.jpg",
    // Lucy Maina is represented by RafikiHub Talent Management
    talentManagement: "/images/people/lucy-maina.jpg",
    community: "/images/sections/community.jpg",
  },
} as const;
