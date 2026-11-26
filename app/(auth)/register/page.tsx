import type { Metadata } from "next"
import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { RegisterForm } from "@/components/auth/register-form"
import { parseRole } from "@/lib/roles"

export const metadata: Metadata = {
  title: "Create Account — HireLoop",
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // /register?role=recruiter or ?role=admin selects that role by default
  const { role } = await searchParams
  const defaultRole = parseRole(role)

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
