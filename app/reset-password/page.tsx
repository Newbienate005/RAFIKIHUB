import type { Metadata } from "next";
import Link from "next/link";
import { ResetForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  return (
    <section className="section">
      <div className="wrap auth">
        <h1 className="auth__title">Choose a new password</h1>
        {token ? (
          <div className="panel"><ResetForm token={token} /></div>
        ) : (
          <div className="panel">
            <p>This page needs the link from your reset email.</p>
            <Link href="/forgot-password" className="btn btn--sun">Get a reset link</Link>
          </div>
        )}
      </div>
    </section>
  );
}
