import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Forgot your password?", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <section className="section">
      <div className="wrap auth">
        <Link href="/login" className="admin-head__back">← Back to log in</Link>
        <h1 className="auth__title">Forgot your password?</h1>
        <p className="lead">Enter your email and we&apos;ll send you a link to choose a new one.</p>
        <div className="panel"><ForgotForm /></div>
        <p className="small auth__note">No longer have that email address? Email <a href="mailto:info@rafikihub.com">info@rafikihub.com</a> from your current one and the team will help.</p>
      </div>
    </section>
  );
}
