/**
 * Every image on the site is referenced from here.
 *
 * 1. Run `npm run images:import` to download all images from the old rafikihub.com
 *    into /public/images/legacy (open public/images/legacy/index.html to browse them).
 * 2. Copy the paths you want into the slots below, e.g. "/images/legacy/kate-snow.jpg".
 *
 * Any slot whose file doesn't exist yet shows a tidy placeholder instead of a broken image.
 */
export const images = {
  /** Leave as null to use the all-caps RAFIKIHUB wordmark. Set a path to use an image logo instead. */
  logo: null as string | null,
  ogDefault: "/images/legacy/og.jpg",

  // Hero contact sheet: six performer headshots
  hero: [
    { src: "/images/people/june-wekesa.jpg", name: "June Wekesa", role: "Actress" },
    { src: "/images/people/sam-wachira.jpg", name: "Sam Wachira", role: "Independent performer" },
    { src: "/images/people/bob-zenga.jpg", name: "Bob Zenga", role: "Actor" },
    { src: "/images/people/lucy-maina.jpg", name: "Lucy Maina", role: "Actress" },
    { src: "/images/people/derrick-kinyanjui.jpg", name: "Derrick Kinyanjui", role: "Actor" },
    { src: "/images/people/mirell-nazi.jpg", name: "Mirell Nazi", role: "Independent performer" },
  ],

  sections: {
    performers: "/images/legacy/performers.jpg",
    casting: "/images/legacy/casting.jpg",
    workshop: "/images/legacy/workshop.jpg",
    talentManagement: "/images/legacy/talent-management.jpg",
  },
} as const;
