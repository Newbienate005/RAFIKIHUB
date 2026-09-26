import { z } from "zod";

const req = (label: string, max = 200) =>
  z.string({ required_error: `Enter your ${label}.` }).trim().min(1, `Enter your ${label}.`).max(max);
const opt = (max = 200) => z.string().trim().max(max).optional().or(z.literal(""));
const email = z.string({ required_error: "Enter your email address." }).trim().email("Enter an email address like name@example.com.").max(200);
const phone = z.string({ required_error: "Enter a phone number, including the country code." }).trim().min(7, "Enter a phone number, including the country code.").max(40);
// Never fails validation: a filled honeypot is silently accepted and dropped in lib/api.ts
const honeypot = z.string().optional();

export const joinSchema = z.object({
  fullName: req("full name", 160),
  email,
  phone,
  category: z.string({ required_error: "Choose what you're joining as." }).trim().min(1, "Choose what you're joining as.").max(80),
  plan: z.enum(["basic", "standard", "premium", "undecided"]).optional().or(z.literal("")),
  location: opt(120),
  message: opt(2000),
  website: honeypot,
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

export const nameCheckSchema = z.object({ name: z.string().trim().min(2, "Enter at least two letters.").max(160) });
