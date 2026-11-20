import type { Metadata } from "next"
import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In — HireLoop",
}

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to track applications and discover new roles."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  )
}
