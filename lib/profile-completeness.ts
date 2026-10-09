import type { TalentProfile } from "./data";

/**
 * How complete a talent profile is, as a percentage and a list of what's missing.
 * Stored on talent_profiles.completeness when a profile is saved or imported, so the admin can
 * filter for 100% complete profiles (e.g. to feature them on the home page).
 */
const checks: { label: string; done: (p: TalentProfile) => boolean }[] = [
  { label: "A headshot", done: (p) => p.media.headshots.length > 0 },
  { label: "At least 3 headshots", done: (p) => p.media.headshots.length >= 3 },
  { label: "A bio", done: (p) => Boolean(p.bio?.trim()) },
  { label: "Playing age", done: (p) => Boolean(p.personalData.playingAge) },
  { label: "Height", done: (p) => Boolean(p.personalData.height) },
  { label: "Date of birth", done: (p) => Boolean(p.personalData.dateOfBirth) },
  { label: "Cities they work in", done: (p) => p.cities.length > 0 },
  { label: "Nationality", done: (p) => p.nationalities.length > 0 },
  { label: "Appearance (look, eyes, hair)", done: (p) => Boolean(p.appearance.appearance && p.appearance.eyeColor && p.appearance.hairColor) },
  { label: "Skills or languages", done: (p) => p.skills.length > 0 || p.languages.length > 0 },
  { label: "Credits", done: (p) => p.credits.length > 0 },
  { label: "Training", done: (p) => p.training.length > 0 },
  { label: "A showreel", done: (p) => Boolean(p.media.showreelUrl) },
];

/** Pets are judged on what a production casting an animal needs to know. */
const petChecks: { label: string; done: (p: TalentProfile) => boolean }[] = [
  { label: "A photo", done: (p) => p.media.headshots.length > 0 },
  { label: "At least 3 photos", done: (p) => p.media.headshots.length >= 3 },
  { label: "A description", done: (p) => Boolean(p.bio?.trim()) },
  { label: "Type of animal", done: (p) => Boolean(p.pet?.type) },
  { label: "Breed", done: (p) => Boolean(p.pet?.breed) },
  { label: "Size", done: (p) => Boolean(p.pet?.size) },
  { label: "Training level", done: (p) => Boolean(p.pet?.trained && p.pet.trainingLevel) || p.pet?.trained === false },
  { label: "Skills", done: (p) => (p.pet?.skills.length ?? 0) > 0 },
  { label: "Personality", done: (p) => Boolean(p.pet?.personality) },
  { label: "Cities they work in", done: (p) => p.cities.length > 0 },
  { label: "A showreel", done: (p) => Boolean(p.media.showreelUrl) },
];

export function profileCompleteness(p: TalentProfile) {
  const list = p.category === "Pet" ? petChecks : checks;
  const missing = list.filter((c) => !c.done(p)).map((c) => c.label);
  return { percent: Math.round(((list.length - missing.length) / list.length) * 100), missing };
}
