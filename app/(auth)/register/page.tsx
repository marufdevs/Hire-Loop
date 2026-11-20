import type { Metadata } from "next"
import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { RegisterForm, type Role } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account — HireLoop",
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // /register?role=recruiter opens the form with "Recruiter" selected
  const { role } = await searchParams
  const defaultRole: Role = role === "recruiter" ? "recruiter" : "seeker"

  return (
    <AuthCard
      title="Create your account"
      description="Join HireLoop in under three minutes. It's free."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm defaultRole={defaultRole} />
    </AuthCard>
  )
}
