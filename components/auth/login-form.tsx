"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  authInputClass,
  Field,
  fieldA11y,
  FormNotice,
  SubmitButton,
} from "@/components/auth/form-parts"
import { PasswordInput } from "@/components/auth/password-input"
import {
  collectErrors,
  validateEmail,
  type FieldErrors,
} from "@/components/auth/validation"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

function LoginForm() {
  const router = useRouter()
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [pending, setPending] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email") ?? "").trim()
    const password = String(data.get("password") ?? "")

    const nextErrors = collectErrors({
      email: validateEmail(email),
      password: password ? undefined : "Enter your password",
    })
    setErrors(nextErrors)
    setFormError(null)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      })

      if (error) {
        if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
          setFormError("Incorrect email or password. Please try again.")
        } else if (error.code === "EMAIL_NOT_VERIFIED") {
          setFormError("Please verify your email address before signing in.")
        } else {
          setFormError(
            error.message || "We couldn't sign you in. Please try again."
          )
        }
        return
      }

      // Signing in creates a session, so take the user straight home.
      router.push("/")
      router.refresh()
    } catch {
      setFormError("Something went wrong. Check your connection and try again.")
    } finally {
      setPending(false)
    }
  }

  // Clear a field's error as soon as the user edits it
  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const { name } = event.target as HTMLInputElement
    setFormError(null)
    if (!errors[name]) return
    setErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="flex flex-col gap-5"
    >
      <Field id="email" label="Email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={authInputClass}
          {...fieldA11y("email", errors.email)}
        />
      </Field>

      <Field id="password" label="Password" error={errors.password}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...fieldA11y("password", errors.password)}
        />
      </Field>

      {formError && <FormNotice variant="error">{formError}</FormNotice>}

      <SubmitButton pending={pending}>
        {pending ? "Signing in…" : "Sign In"}
      </SubmitButton>
    </form>
  )
}

export { LoginForm }
