import {
  appearanceOptions, appearanceTraitOptions, eyeColorOptions, facialHairOptions, hairColorOptions, hairLengthOptions,
  profileCategories, voiceCharacterOptions, voiceQualityOptions,
  type Measurement, type TalentProfile,
} from "@/lib/data";

/**
 * The talent profile editor's fields ⇄ the TalentProfile JSON stored on talent_profiles.data.
 * Lists use one item per line; credits and training use "a | b | c" columns, like a simple table.
 */

export const creditTypes = ["Film", "TV", "Theatre", "Commercial", "Radio", "Voice Over", "Music Video", "Other"] as const;
export const measurementKeys = ["bustChest", "waist", "hips", "insideLeg", "insideArm", "collar", "hat"] as const;
export const measurementLabels: Record<(typeof measurementKeys)[number], string> = {
  bustChest: "Bust / chest", waist: "Waist", hips: "Hips", insideLeg: "Inside leg", insideArm: "Inside arm", collar: "Collar", hat: "Hat",
};

export const profileOptions = {
  category: profileCategories, appearance: appearanceOptions, eyeColor: eyeColorOptions, hairColor: hairColorOptions,
  hairLength: hairLengthOptions, facialHair: facialHairOptions, voiceQuality: voiceQualityOptions, voiceCharacter: voiceCharacterOptions,
  trait: appearanceTraitOptions,
};

export function emptyProfile(): TalentProfile {
  return {
    profileUrl: "", fullName: "", category: "Actor",
    contactDetails: { country: "Kenya", website: null, phone: null, email: null, address: null },
    personalData: { dateOfBirth: null, playingAge: null, country: "Kenya", height: null },
    cities: [], nationalities: [],
    appearance: { appearance: null, eyeColor: null, hairColor: null, hairLength: null, facialHair: null },
    voiceAttributes: { voiceQuality: null, voiceCharacter: null },
    voiceRange: { lowVoice: null, mediumVoice: null, highVoice: null },
    furtherMeasurements: { bustChest: null, waist: null, hips: null, insideLeg: null, insideArm: null, collar: null, hat: null, weightKg: null, shoeSize: null, dressSize: null },
    appearanceTraits: [], bio: null, skills: [], languages: [], accents: [], credits: [], training: [],
    media: { headshots: [], showreelUrl: null, voiceoverReelUrl: null, documents: [] },
    isEnhanced: false, representedByRafikiHub: false, createdAt: new Date().toISOString().slice(0, 10),
  };
}

/* ── to the form ── */
export const linesOf = (a: string[]) => a.join("\n");
export const creditsText = (p: TalentProfile) => p.credits.map((c) => [c.year, c.production, c.role, c.type, c.director ?? ""].join(" | ").replace(/ \| $/, "")).join("\n");
export const trainingText = (p: TalentProfile) => p.training.map((t) => [t.institution, t.course, t.year ?? ""].join(" | ").replace(/ \| $/, "")).join("\n");
export const traitsText = (p: TalentProfile) => p.appearanceTraits.map((t) => `${t.trait} | ${t.location}`).join("\n");
export const documentsText = (p: TalentProfile) => p.media.documents.map((d) => `${d.name} | ${d.url}`).join("\n");

/* ── from the form ── */
type Errors = Record<string, string>;

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const opt = (f: FormData, k: string) => str(f, k) || null;
const lines = (f: FormData, k: string) => str(f, k).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const cols = (line: string) => line.split("|").map((c) => c.trim());

function pick<T extends readonly string[]>(f: FormData, k: string, options: T, errors: Errors): T[number] | null {
  const v = str(f, k);
  if (!v) return null;
  if (!options.includes(v)) { errors[k] = "Pick one of the options."; return null; }
  return v as T[number];
}

function int(f: FormData, k: string, errors: Errors, min: number, max: number): number | null {
  const v = str(f, k);
  if (!v) return null;
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) { errors[k] = `Enter a whole number from ${min} to ${max}.`; return null; }
  return n;
}

function url(f: FormData, k: string, errors: Errors) {
  const v = str(f, k);
  if (!v) return null;
  if (!/^https?:\/\/\S+$/i.test(v)) errors[k] = "Enter a full link starting with https://";
  return v;
}

export function parseProfileForm(f: FormData, base: TalentProfile): { profile: TalentProfile } | { errors: Errors } {
  const errors: Errors = {};
  const fullName = str(f, "fullName");
  if (!fullName) errors.fullName = "Add their name.";
  // Not lower-cased: old-site links are random strings with capitals, and they must keep working
  const profileUrl = str(f, "profileUrl");
  if (!/^(?!\.{1,2}$)[A-Za-z0-9._-]{1,120}$/.test(profileUrl)) errors.profileUrl = "Use letters, numbers, dots, dashes or underscores, with no spaces.";
  const category = pick(f, "category", profileCategories, errors);
  if (!category) errors.category ??= "Choose a category.";

  const ageMin = int(f, "ageMin", errors, 1, 99);
  const ageMax = int(f, "ageMax", errors, 1, 99);
  if ((ageMin === null) !== (ageMax === null)) errors.ageMax = "Give both ends of the playing age, or neither.";
  else if (ageMin !== null && ageMax !== null && ageMin > ageMax) errors.ageMax = "The top of the range must be at least the bottom.";
  const feet = int(f, "heightFeet", errors, 2, 8);
  const inches = int(f, "heightInches", errors, 0, 11);
  if (feet === null && inches !== null) errors.heightFeet = "Add feet as well.";

  const dob = str(f, "dateOfBirth");
  if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) errors.dateOfBirth = "Pick a date.";

  const measurement = (k: string): Measurement | null => {
    const v = str(f, `m_${k}`);
    if (!v) return null;
    const value = Number(v);
    if (!(value > 0 && value < 300)) { errors[`m_${k}`] = "Enter a number."; return null; }
    return { value, unit: str(f, `m_${k}_unit`) === "cm" ? "cm" : "inches" };
  };

  const credits: TalentProfile["credits"] = [];
  lines(f, "credits").forEach((line, i) => {
    const [year, production, role, type, director] = cols(line);
    const y = Number(year);
    if (!(y >= 1950 && y <= 2100) || !production || !role) { errors.credits = `Line ${i + 1}: use Year | Production | Role | Type | Director (director optional).`; return; }
    const t = creditTypes.find((c) => c.toLowerCase() === (type ?? "").toLowerCase()) ?? "Other";
    credits.push({ year: y, production, role, type: t, ...(director ? { director } : {}) });
  });

  const training: TalentProfile["training"] = [];
  lines(f, "training").forEach((line, i) => {
    const [institution, course, year] = cols(line);
    if (!institution || !course) { errors.training = `Line ${i + 1}: use Institution | Course | Year (year optional).`; return; }
    const y = Number(year);
    training.push({ institution, course, ...(year && y > 1900 ? { year: y } : {}) });
  });

  const appearanceTraits: TalentProfile["appearanceTraits"] = [];
  lines(f, "traits").forEach((line, i) => {
    const [trait, location = ""] = cols(line);
    const t = appearanceTraitOptions.find((o) => o.toLowerCase() === trait.toLowerCase());
    if (!t) { errors.traits = `Line ${i + 1}: the trait must be one of ${appearanceTraitOptions.join(", ")}.`; return; }
    appearanceTraits.push({ trait: t, location });
  });

  const documents: TalentProfile["media"]["documents"] = [];
  lines(f, "documents").forEach((line, i) => {
    const [name, link] = cols(line);
    if (!name || !/^https?:\/\//.test(link ?? "")) { errors.documents = `Line ${i + 1}: use Name | https://link`; return; }
    documents.push({ name, url: link });
  });

  const weight = str(f, "weightKg");
  const weightKg = weight ? Number(weight) : null;
  if (weight && !(weightKg! > 0 && weightKg! < 300)) errors.weightKg = "Enter a weight in kg.";

  const headshots = lines(f, "headshots");
  const email = opt(f, "email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";

  // Everything that can add an error is worked out before the check below
  const website = url(f, "website", errors);
  const showreelUrl = url(f, "showreelUrl", errors);
  const voiceoverReelUrl = url(f, "voiceoverReelUrl", errors);
  const appearance = {
    appearance: pick(f, "appearance", appearanceOptions, errors), eyeColor: pick(f, "eyeColor", eyeColorOptions, errors),
    hairColor: pick(f, "hairColor", hairColorOptions, errors), hairLength: pick(f, "hairLength", hairLengthOptions, errors),
    facialHair: pick(f, "facialHair", facialHairOptions, errors),
  };
  const voiceAttributes = { voiceQuality: pick(f, "voiceQuality", voiceQualityOptions, errors), voiceCharacter: pick(f, "voiceCharacter", voiceCharacterOptions, errors) };
  const furtherMeasurements = {
    bustChest: measurement("bustChest"), waist: measurement("waist"), hips: measurement("hips"), insideLeg: measurement("insideLeg"),
    insideArm: measurement("insideArm"), collar: measurement("collar"), hat: measurement("hat"),
    weightKg, shoeSize: opt(f, "shoeSize"), dressSize: opt(f, "dressSize"),
  };

  if (Object.keys(errors).length) return { errors };
  return {
    profile: {
      ...base,
      profileUrl, fullName, category: category!,
      contactDetails: { country: str(f, "contactCountry") || "Kenya", website, phone: opt(f, "phone"), email, address: opt(f, "address") },
      personalData: {
        dateOfBirth: dob || null,
        playingAge: ageMin !== null && ageMax !== null ? { min: ageMin, max: ageMax } : null,
        country: str(f, "country") || "Kenya",
        height: feet !== null ? { feet, inches: inches ?? 0 } : null,
      },
      cities: lines(f, "cities"),
      nationalities: lines(f, "nationalities"),
      appearance,
      voiceAttributes,
      voiceRange: { lowVoice: opt(f, "lowVoice"), mediumVoice: opt(f, "mediumVoice"), highVoice: opt(f, "highVoice") },
      furtherMeasurements,
      appearanceTraits,
      bio: opt(f, "bio"),
      skills: lines(f, "skills"), languages: lines(f, "languages"), accents: lines(f, "accents"),
      credits: credits.sort((a, b) => b.year - a.year),
      training,
      media: { headshots, showreelUrl, voiceoverReelUrl, documents },
      isEnhanced: f.get("isEnhanced") === "on",
      representedByRafikiHub: f.get("represented") === "on",
    },
  };
}
