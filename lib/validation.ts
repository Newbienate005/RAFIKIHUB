import { z } from "zod";

const req = (label: string, max = 200) =>
  z.string({ required_error: `Enter your ${label}.` }).trim().min(1, `Enter your ${label}.`).max(max);
const opt = (max = 200) => z.string().trim().max(max).optional().or(z.literal(""));
const email = z.string({ required_error: "Enter your email address." }).trim().email("Enter an email address like name@example.com.").max(200);
const phone = z.string({ required_error: "Enter a phone number, including the country code." }).trim().min(7, "Enter a phone number, including the country code.").max(40);
// Never fails validation: a filled honeypot is silently accepted and dropped in lib/api.ts
const honeypot = z.string().optional();

/** Under 18 on the day they join, from a yyyy-mm-dd date of birth */
export const isUnder18 = (dob: string) => {
  const d = new Date(`${dob}T00:00:00`);
  const eighteen = new Date(d.getFullYear() + 18, d.getMonth(), d.getDate());
  return eighteen > new Date();
};

/** The join form: the same details the old rafikihub.com asked for, plus a password so the account works straight away. */
export const joinSchema = z
  .object({
    fullName: req("full name", 160),
    email,
    phone,
    country: z.string({ required_error: "Choose your country." }).trim().min(1, "Choose your country.").max(80),
    gender: z.enum(["Female", "Male", "Other"]).optional().or(z.literal("")),
    dateOfBirth: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date of birth.").optional().or(z.literal("")),
    category: z.string({ required_error: "Choose what you're joining as." }).trim().min(1, "Choose what you're joining as.").max(80),
    talentCategory: opt(80),
    guardian: z.enum(["Parent", "Guardian"]).optional().or(z.literal("")),
    password: z.string({ required_error: "Choose a password." }).min(8, "Use at least 8 characters.").max(200, "That's too long: use up to 200 characters."),
    passwordRepeat: z.string({ required_error: "Type the same password again." }),
    plan: z.enum(["basic", "standard", "premium", "undecided"]).optional().or(z.literal("")),
    location: opt(120),
    message: opt(2000),
    website: honeypot,
  })
  .refine((d) => d.password === d.passwordRepeat, { path: ["passwordRepeat"], message: "The two passwords don't match." })
  .refine((d) => !d.dateOfBirth || new Date(`${d.dateOfBirth}T00:00:00`) < new Date(), { path: ["dateOfBirth"], message: "That date is in the future." })
  // A parent or guardian registers anyone under 18
  .refine((d) => d.guardian || !(/young/i.test(d.category) || (d.dateOfBirth && isUnder18(d.dateOfBirth))), {
    path: ["guardian"],
    message: "Performers under 18 are registered by a parent or guardian: choose which you are.",
  });

export const castingSchema = z.object({
  company: req("company or production name"),
  contactName: req("name", 160),
  email,
  phone: opt(40),
  projectTitle: req("project title"),
  projectType: z.string({ required_error: "Choose a project type." }).trim().min(1, "Choose a project type.").max(80),
  shootDates: opt(120),
  location: opt(120),
  details: req("role details", 5000),
  website: honeypot,
});

export const contactSchema = z.object({
  fullName: req("name", 160),
  email,
  topic: z.string({ required_error: "Choose a topic." }).trim().min(1, "Choose a topic.").max(80),
  message: req("message", 5000),
  website: honeypot,
});

export const newsletterSchema = z.object({ email, website: honeypot });

export const bookingSchema = z.object({
  service: z.enum(["headshots", "showreels", "audition-preps"], { errorMap: () => ({ message: "Choose a service." }) }),
  fullName: req("name", 160),
  email,
  phone,
  preferredDate: opt(60),
  notes: opt(2000),
  website: honeypot,
});

export const locationTypes = [
  "Office space", "Village or town", "Housing (apartment, house, bungalow…)",
  "In nature (forest, mountain, beach, river, lake, bush, savannah…)", "Sports facility", "Bars and restaurants",
  "Farms", "Government facility", "Studio space or green screen", "Other",
] as const;

export const locationRequestSchema = z.object({
  organization: req("organisation"),
  email,
  country: opt(80),
  phone: opt(40),
  nature: req("type of project or production"),
  crew: opt(40),
  fromDate: opt(40),
  toDate: opt(40),
  locationType: z.enum(locationTypes, { errorMap: () => ({ message: "Choose the kind of location you need." }) }),
  services: opt(300),
  details: opt(3000),
  website: honeypot,
});

export const nameCheckSchema = z.object({ name: z.string().trim().min(2, "Enter at least two letters.").max(160) });
