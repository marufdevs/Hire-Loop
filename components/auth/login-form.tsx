"use client"

import * as React from "react"

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

function LoginForm() {
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [pending, setPending] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

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
    setSubmitted(false)
    if (Object.keys(nextErrors).length > 0) return

    // UI only for now: pretend to send, then explain nothing was sent.
    // Replace this with the real sign-in call when the backend is ready.
    setPending(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setPending(false)
    setSubmitted(true)
  }

  // Clear a field's error as soon as the user edits it
  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const { name } = event.target as HTMLInputElement
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

      {submitted && (
        <FormNotice>
          Looks good! Sign in isn&apos;t connected to a server yet, so nothing
          was sent.
        </FormNotice>
      )}

      <SubmitButton pending={pending}>
        {pending ? "Signing in…" : "Sign In"}
      </SubmitButton>
    </form>
  )
}

export { LoginForm }
