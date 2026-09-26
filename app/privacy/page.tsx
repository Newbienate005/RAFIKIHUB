import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

// CHECK BEFORE LAUNCH: this is a draft based on what this website actually collects.
// Have it reviewed against the Kenya Data Protection Act 2019, then delete the `robots` line below.
export const metadata: Metadata = {
  ...pageMeta({ title: "Privacy Policy", description: "How RafikiHub collects, uses and protects your personal information.", path: "/privacy" }),
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      updated="September 2026"
      intro={`How ${site.legalName} collects, uses and protects your personal information.`}
      other={{ href: "/terms", label: "Read our Terms and Conditions" }}
      sections={[
        { title: "1. Who we are", body: [`${site.legalName} ("RafikiHub", "we") runs rafikihub.com from ${site.address.building}, ${site.address.street}, ${site.address.area}, Nairobi, Kenya. We are responsible for the personal information described in this policy.`] },
        { title: "2. What we collect", body: [
          "When you apply for membership: your name, email address, phone number, the membership type and plan you choose, your town or city, and anything you tell us about your experience.",
          "When you build a profile: the details you choose to add, which can include your date of birth, playing age, height, appearance, measurements, voice attributes, skills, credits, training, photos, showreels, voice reels and documents.",
          "When you post a casting, book a service, contact us or subscribe to our emails: the details you enter in that form.",
          "When you browse the site: basic technical information such as your IP address and browser type, which our hosting provider records to keep the site running and secure.",
        ] },
        { title: "3. How we use it", body: ["To set up and manage your membership, show your profile to casting professionals, send you castings that match you, arrange services you book, reply to your messages, send emails you have subscribed to, and keep the platform safe."] },
        { title: "4. Who can see your information", body: [
          "Published profiles can be seen by casting professionals and visitors to the site. You decide what goes on your profile.",
          "Your contact details are shared with a casting professional or production only when needed for a role you have applied for.",
          "We use trusted service providers to run the site, including our hosting provider (Vercel) and our database provider (Neon), which may store data outside Kenya. We never sell your personal information.",
        ] },
        { title: "5. Young performers", body: ["Profiles for performers under 18 must be created and managed by a parent or guardian, who is our point of contact for that performer."] },
        { title: "6. How long we keep it", body: ["We keep your information while your membership is active and for a limited period afterwards where the law requires it. You can ask us to delete your profile at any time."] },
        { title: "7. Your rights", body: ["Under the Data Protection Act 2019, you can ask to see the personal information we hold about you, correct it, delete it, or object to how we use it. You can also complain to the Office of the Data Protection Commissioner."] },
        { title: "8. Contact us", body: [`Email ${site.email} or call ${site.phoneDisplay} with any questions about this policy.`] },
      ]}
    />
  );
}
