import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

// CHECK BEFORE LAUNCH: draft terms. Have them reviewed by a lawyer, then delete the `robots` line below.
export const metadata: Metadata = {
  ...pageMeta({ title: "Terms and Conditions", description: "The terms for using RafikiHub and RafikiHub membership.", path: "/terms" }),
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      path="/terms"
      updated="September 2026"
      intro="The rules for using RafikiHub and RafikiHub membership."
      other={{ href: "/privacy", label: "Read our Privacy Policy" }}
      sections={[
        { title: "1. About these terms", body: [`These terms apply to your use of rafikihub.com, run by ${site.legalName}. By using the site or becoming a member, you agree to them and to our Privacy Policy.`] },
        { title: "2. Membership", body: ["Membership plans and prices are shown on our Membership Options page. Your membership covers the period of the plan you choose. We confirm payment details when we set up your membership."] },
        { title: "3. Your profile", body: ["Information on your profile must be accurate and up to date, and photos and media must be of you and yours to use. Profiles for performers under 18 must be created and managed by a parent or guardian."] },
        { title: "4. Castings are confidential", body: ["Casting information on RafikiHub is private and confidential. Sharing it outside the platform breaches the production's copyright and these terms, and any member found circulating casting information will have their membership terminated."] },
        { title: "5. Casting professionals", body: ["Anyone posting a casting must describe the opportunity accurately, including pay and usage where known, and treat applicants with respect. We may remove castings that break these rules."] },
        { title: "6. Your content", body: ["You keep ownership of the photos, videos and other content you upload. You allow RafikiHub to display that content on the platform and share it with casting professionals for the purpose of finding you work."] },
        { title: "7. Services and workshops", body: ["Bookings for Sio Bahati Services and workshops are confirmed by us in writing, including the price and date. Any cancellation terms are set out in that confirmation."] },
        { title: "8. Ending your membership", body: ["You can ask us to close your account at any time. We may suspend or end a membership that breaks these terms, including misuse of castings or unsafe behaviour towards other members, especially young performers."] },
        { title: "9. Liability", body: ["RafikiHub connects performers with casting professionals but does not guarantee work, auditions or bookings. Nothing in these terms limits rights you have under Kenyan consumer law."] },
        { title: "10. Governing law and contact", body: [`These terms are governed by the laws of Kenya. Questions? Email ${site.email} or call ${site.phoneDisplay}.`] },
      ]}
    />
  );
}
